import { Authenticator } from 'remix-auth';
import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { GoogleStrategy } from 'remix-auth-google';

import { type Env } from 'server';

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
    async ({ profile }) => {
      // Get the user data from your DB or API using the tokens and profile
      return {
        name: profile.displayName,
        email: profile.emails[0].value
      };
    }
  );

  authenticator.use(googleStrategy);

  return authenticator;
};
