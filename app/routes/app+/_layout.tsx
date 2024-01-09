import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Outlet, useNavigate } from '@remix-run/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { requireUser } from '~/services/auth.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return await requireUser({ request, context });
};

const AppLayout = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <div className="min-h-screen container mx-auto">
      <Button onClick={goBack} variant="default" className="mt-10 mb-4" size="sm">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Outlet />
    </div>
  );
};

export default AppLayout;
