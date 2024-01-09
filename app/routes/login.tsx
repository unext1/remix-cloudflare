import { type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';

export async function action({ context, request }: ActionFunctionArgs) {
  return await context.session.authenticate('google', request, {
    successRedirect: $path('/app'),
    failureRedirect: $path('/login')
  });
}
export async function loader({ context, request }: LoaderFunctionArgs) {
  await context.session.isAuthenticated(request, {
    successRedirect: $path('/app')
  });
  return {};
}

export default function AuthenticationPage() {
  return (
    <div className="mx-auto container">
      <Form method="post">
        <Button type="submit">Google</Button>
      </Form>
    </div>
  );
}
