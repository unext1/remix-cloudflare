import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { H1 } from '~/components/ui/typography';
import { requireUser } from '~/services/auth.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });

  return json({ user });
};

const ProfilePage = () => {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <H1>Profile Page</H1>
      {user.name}
      <img
        src={user.imageUrl ? user.imageUrl : 'https://thispersondoesnotexist.com'}
        className="h-8 w-8 rounded-full"
        alt="user"
      />
    </div>
  );
};
export default ProfilePage;
