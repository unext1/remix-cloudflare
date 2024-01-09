import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';
import { AppLayout as Layout } from '~/components/layout';
import { requireUser } from '~/services/auth.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });
  return json({ user });
};

const AppLayout = () => {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Layout user={user}>
      <Outlet />
    </Layout>
  );
};

export default AppLayout;
