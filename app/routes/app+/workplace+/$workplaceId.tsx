import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { H1, H2 } from '~/components/ui/typography';
import { db } from '~/db/client.server';
import { imageTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';
import { getWorkplace } from '~/services/workplace.server';

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });

  const userImages = await db(context.env.DB).query.imageTable.findMany({
    where: eq(imageTable.userId, user.id)
  });

  const workplace = await getWorkplace({ userId: user.id, workplaceId: Number(params.workplaceId), context });
  return json({ user, workplace, userImages });
};

const WorkplacePage = () => {
  const { user, workplace, userImages } = useLoaderData<typeof loader>();

  return (
    <div>
      <H1 className="mb-2">Welcome to your Workplace</H1>
      <pre>{JSON.stringify(workplace, null, 4)}</pre>

      <H2 className="mt-6 mb-2">Galery</H2>
      <Form method="post" encType="multipart/form-data" action={$path('/api/images')}>
        <Input type="file" name="image" />
        <Button variant="secondary" type="submit" size="sm" className="mt-2">
          Submit
        </Button>
      </Form>

      <div className="grid grid-cols-5 gap-6 mt-6">
        {userImages.map((image) => (
          <Form method="delete" key={image.id} action={$path('/api/images/:imageId', { imageId: image.id })}>
            <input name="imageId" type="hidden" value={image.id} />
            <div className="relative">
              <Button className="absolute top-2 z-10 right-2" type="submit" size="sm" variant="destructive">
                Delete
              </Button>
              <img
                key={image.id}
                src={$path('/api/images/:imageId', { imageId: image.id })}
                alt=""
                className="h-52 object-cover w-full"
              />
            </div>
          </Form>
        ))}
      </div>
    </div>
  );
};
export default WorkplacePage;
