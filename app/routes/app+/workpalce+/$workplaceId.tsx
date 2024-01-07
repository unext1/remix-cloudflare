import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { requireUser } from '~/services/auth.server';
import { getWorkplace } from '~/services/workplace.server';

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });

  const workplace = await getWorkplace({ userId: user.id, workplaceId: Number(params.workplaceId), context });
  console.log(workplace);
  return json({ user, workplace });
};

const WorkplacePage = () => {
  const { user, workplace } = useLoaderData<typeof loader>();
  console.log(workplace);
  return (
    <div>
      <h1>Welcome to your workplace</h1>
      <pre>{JSON.stringify(workplace, null, 4)} </pre>
    </div>
  );
};
export default WorkplacePage;
