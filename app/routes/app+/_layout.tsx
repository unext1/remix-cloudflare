import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Outlet } from '@remix-run/react';
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
