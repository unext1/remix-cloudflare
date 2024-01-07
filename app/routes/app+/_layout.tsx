import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';
import { H3 } from '~/components/ui/typography';
import { requireUser } from '~/services/auth.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return await requireUser({ request, context });
};

const AppLayout = () => {
  return (
    <div className="min-h-screen container mx-auto">
      <Outlet />
    </div>
  );
};

export default AppLayout;
