import { type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';

export async function action({ context, request }: ActionFunctionArgs) {
  return await context.session.authenticate('google', request, {
    successRedirect: '/',
    failureRedirect: '/login'
  });
}
export async function loader({ context, request }: LoaderFunctionArgs) {
  await context.session.isAuthenticated(request, {
    successRedirect: '/login'
  });
  return {};
}

export default function AuthenticationPage() {
  return (
    <div>
      <Form method="post">
        <button type="submit" className="w-full text-white">
          Google
        </button>
      </Form>
    </div>
  );
}
