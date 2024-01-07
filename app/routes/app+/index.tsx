import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, json, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import { requireUser } from '~/services/auth.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });
  return json({ user });
};

const AppPage = () => {
  const user = useLoaderData<typeof loader>();
  return (
    <div>
      <pre>{JSON.stringify(user, null, 4)}</pre>
      <h1>App page</h1>
      <Form method="post" className="mt-6" action={$path('/auth/logout')}>
        <Button variant="destructive">Logout</Button>
      </Form>
    </div>
  );
};

export default AppPage;
