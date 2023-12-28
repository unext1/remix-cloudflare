import { type LoaderFunctionArgs } from '@remix-run/cloudflare';

export function loader({ context, request }: LoaderFunctionArgs) {
  return context.session.authenticate('google', request, {
    failureRedirect: '/login',
    successRedirect: '/'
  });
}
