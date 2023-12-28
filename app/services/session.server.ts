import { createCookie } from '@remix-run/cloudflare';
import { CSRF } from 'remix-utils/csrf/server';
import { createTypedCookie } from 'remix-utils/typed-cookie';
import { z } from 'zod';

export const cookie = (name: string, secret: string) =>
  createCookie(name, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    secrets: [secret]
  });

export const csrfToken = (cookieSecret: string, csrfSecret: string) => {
  const csrf = new CSRF({
    cookie: cookie('csrf', cookieSecret),
    formDataKey: 'csrf',
    secret: csrfSecret
  });

  return csrf;
};

export const sessionCookie = (cookieSecret: string) => {
  return createTypedCookie({
    cookie: cookie('_session', cookieSecret),
    schema: z.string()
  });
};
