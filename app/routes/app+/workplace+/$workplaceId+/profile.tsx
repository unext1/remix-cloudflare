import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useFetcher, useLoaderData, useLocation, useNavigation } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import { z } from 'zod';
import { zx } from 'zodix';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { P } from '~/components/ui/typography';
import { db } from '~/db/client.server';
import { userTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';
import { type action as imageAction } from '~/routes/api+/images+/$userId.profile-image';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });

  return json({ user });
};

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser({ context, request });
  const { name } = await zx.parseForm(request, {
    name: z.string().min(1)
  });

  return await db(context.env.DB).update(userTable).set({ name }).where(eq(userTable.id, user.id));
}

const ProfilePage = () => {
  const { user } = useLoaderData<typeof loader>();

  const location = useLocation();
  const { state } = useNavigation();
  const fetcher = useFetcher<typeof imageAction>();
  return (
    <div>
      <h1 className="mb-5">Profile</h1>

      <div className="flex space-x-2 pb-5">
        <img alt="profile" src={user.imageUrl || ''} className="h-8 w-8 my-auto rounded-full" />
        <div className="flex flex-col justify-center">
          <div className="font-semibold capitalize">{user.name}</div>
          <div className="uppercase text-xs">{user.email}</div>
        </div>
      </div>

      <div className="space-y-4 ">
        <div>
          <Label className="mb-1" htmlFor="name">
            Email
          </Label>

          <Input type="email" className="bg-card text-white md:w-fit" disabled value={user.email} />
        </div>
        <Form method="post">
          <Label className="mb-1" htmlFor="name">
            Name
          </Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="name"
              name="name"
              placeholder="Name"
              className="bg-card text-white md:w-fit"
              defaultValue={user.name || ''}
            />
            <Button type="submit" variant="default" size="sm">
              Change Name
            </Button>
          </div>
        </Form>
        <fetcher.Form
          method="post"
          encType="multipart/form-data"
          action={$path('/api/images/:userId/profile-image', { userId: user.id })}
          key={location.key}
        >
          <Label className="mb-1" htmlFor="image">
            Update Profile Image
          </Label>
          <Input type="file" name="image" accept="image/png, image/jpeg" className="w-1/3" />
          {fetcher.data ? <P className="text-red-400 mt-1">{fetcher.data.error}</P> : null}

          <Button variant="default" type="submit" size="sm" className="mt-2">
            {state === 'submitting' ? 'Uploading...' : 'Upload'}
          </Button>
        </fetcher.Form>
      </div>
    </div>
  );
};
export default ProfilePage;
