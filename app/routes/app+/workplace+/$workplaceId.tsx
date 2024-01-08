import {
  type ActionFunctionArgs,
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type LoaderFunctionArgs
} from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { requireUser } from '~/services/auth.server';
import { getWorkplace } from '~/services/workplace.server';

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });
  const object = await context.env.IMAGES.get('laurynas.jpg');
  console.log(object?.body);

  const workplace = await getWorkplace({ userId: user.id, workplaceId: Number(params.workplaceId), context });
  return json({ user, workplace });
};

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log('request', request);
  const image = formData.get('image');
  console.log('image', image);
  const uploadedImage = await context.env.IMAGES.put('kazkas.jpg', image);
  console.log('uploaded image', uploadedImage);

  return {};
}

// export async function action({ request, context }: ActionFunctionArgs) {
//   console.log(request.body);
//   const formData = await request.formData();
//   const key = formData.get('image') as string;
//   // const uploadedImage = await context.env.IMAGES.put(key, '');
//   // console.log(uploadedImage);

//   return {};
// }

const WorkplacePage = () => {
  const { user, workplace } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Welcome to your workplace</h1>
      <pre>{JSON.stringify(workplace, null, 4)} </pre>

      <Form method="post" encType="multipart/form-data">
        <Input type="file" name="image" />
        <Button variant="secondary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
export default WorkplacePage;
