import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { $path } from 'remix-routes';

export function loader({ context, request }: LoaderFunctionArgs) {
  return context.session.authenticate('google', request, {
    failureRedirect: $path('/login'),
    successRedirect: $path('/app')
  });
}
