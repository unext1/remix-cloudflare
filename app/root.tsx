import { json, type LinksFunction, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { cssBundleHref } from '@remix-run/css-bundle';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { getTheme } from '~/services/theme.server';

import tailwind from '~/tailwind.css';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: tailwind }
];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const [token, cookieHeader] = await context.csrf.commitToken(request);
  const colorScheme = await getTheme(request);

  return json({ token, colorScheme }, { headers: { 'set-cookie': cookieHeader || '' } });
}

export default function App() {
  const { token, colorScheme } = useLoaderData<typeof loader>();

  return (
    <html lang="en" data-theme={colorScheme} className="antialiased min-h-screen" style={{ colorScheme }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthenticityTokenProvider token={token}>
          <Outlet />
        </AuthenticityTokenProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
