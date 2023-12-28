import { logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';

import { authSession } from '~/services/auth.server';
import { csrfToken, sessionCookie } from '~/services/session.server';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  SESSION_SECRET: string;
  CSRF_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext extends ReturnType<typeof getLoadContext> {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLoadContext = (context: EventContext<any, any, Record<string, unknown>>) => {
  const csrf = csrfToken(context.env.SESSION_SECRET, context.env.CSRF_SECRET);
  const cookie = sessionCookie(context.env.SESSION_SECRET);
  const session = authSession(context.env.SESSION_SECRET);

  return {
    env: context.env as Env,
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
