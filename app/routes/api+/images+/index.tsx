import {
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type ActionFunctionArgs
} from '@remix-run/cloudflare';

import { db } from '~/db/client.server';
import { imageTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser({ context, request });
  const formData = await unstable_parseMultipartFormData(request, unstable_createMemoryUploadHandler());
  const image = formData.get('image') as File;

  const filePath = `${user.id}/${image.name}`;
  const contentType = image.type;
  const size = image.size;

  if (size > 500000) {
    return json({ error: 'Image is too large', success: false });
  }

  await context.env.IMAGES.put(filePath, image);

  await db(context.env.DB).insert(imageTable).values({
    contentType,
    filePath,
    size,
    userId: user.id
  });
  return json({ error: null, success: true });
}
