import { type LoaderFunctionArgs, createCookieSessionStorage, redirect, AppLoadContext } from '@remix-run/cloudflare';
import { Authenticator } from 'remix-auth';
import { GoogleStrategy } from 'remix-auth-google';
import { $path } from 'remix-routes';

import { eq } from 'drizzle-orm';
import { type Env } from 'server';
import { db } from '~/db/client.server';
import { userTable } from '~/db/schema';
import { nowUTC } from '~/utils/date';

export const createOrUpdateUser = async ({
  env,
  email,
  name,
  imageUrl
}: {
  env: Env;
  email: string;
  name?: string;
  imageUrl?: string;
}) => {
  try {
    const newUser = await db(env.DB)
      .insert(userTable)
      .values({
        email,
        name,
        imageUrl
      })
      .onConflictDoUpdate({ target: [userTable.email], set: { updatedAt: nowUTC() } })
      .returning({ id: userTable.id });

    return newUser[0].id;
  } catch (error) {
    console.error(error);
    return;
  }
};

// type User = Awaited<ReturnType<typeof getUser>>;
const getUser = async ({ userId, context }: { userId: string | null | unknown; context: AppLoadContext }) => {
  if (!userId) {
    return undefined;
  }
  const user = await db(context.env.DB)
    .select()
    .from(userTable)
    .where(eq(userTable.id, Number(userId)));
  return user[0];
};

export type SessionUser = Awaited<ReturnType<typeof requireUser>>;

export const requireUser = async ({ request, context }: { request: Request; context: AppLoadContext }) => {
  const sessionUserId = await context.session.isAuthenticated(request);

  const sessionUser = await getUser({ userId: sessionUserId, context });
  if (sessionUser) {
    return sessionUser;
  } else redirect($path('/'));
};

export const authSession = (env: Env) => {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: '_session', // use any name you want here
      sameSite: 'lax', // this helps with CSRF
      path: '/',
      httpOnly: true, // for security reasons, make this cookie http only
      secrets: [env.SESSION_SECRET], // replace this with an actual secret
      secure: process.env.NODE_ENV === 'production' // enable this in prod only
    }
  });

  const authenticator = new Authenticator(sessionStorage);

  const googleStrategy = new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8788/auth/google/callback'
    },
    ({ profile }) => {
      // Get the user data from your DB or API using the tokens and profile
      return createOrUpdateUser({
        email: profile.emails[0].value,
        name: profile.name.givenName,
        imageUrl: profile.photos?.[0]?.value,
        env
      });
    }
  );

  authenticator.use(googleStrategy);

  return authenticator;
};
