import { logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';
import { z } from 'zod';

import { authSession } from '~/services/auth.server';
import { csrfToken, sessionCookie } from '~/services/session.server';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

const validateEnv = (env: unknown) => {
  const envSchema = z.object({
    SESSION_SECRET: z.string().min(1),
    CSRF_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1)
  });

  return envSchema.parse(env);
};

type EnvVars = ReturnType<typeof validateEnv>;

export interface Env extends EnvVars {
  DB: D1Database;
  IMAGES: R2Bucket;
}

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext extends ReturnType<typeof getLoadContext> {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLoadContext = (context: EventContext<any, any, Record<string, unknown>>) => {
  validateEnv(context.env);
  const env = context.env as Env;
  const csrf = csrfToken(env.SESSION_SECRET, env.CSRF_SECRET);
  const cookie = sessionCookie(env.SESSION_SECRET);
  const session = authSession(env);

  return {
    env,
    cookie,
    session,
    csrf
  };
};

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext,
  mode: build.mode
});
