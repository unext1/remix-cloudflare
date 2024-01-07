import { type ActionFunctionArgs, redirect } from '@remix-run/cloudflare';

export const loader = () => redirect('/');

export const action = ({ request, context }: ActionFunctionArgs) => {
  return context.session.logout(request, { redirectTo: '/' });
};
