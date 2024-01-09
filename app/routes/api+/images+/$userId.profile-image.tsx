import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json
} from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';

import { db } from '~/db/client.server';
import { imageTable, userTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const dbImage = await db(context.env.DB).query.imageTable.findFirst({
    where: eq(imageTable.filePath, `${params.userId}/profile-image`)
  });

  if (dbImage) {
    const object = await context.env.IMAGES.get(dbImage.filePath);

    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Content-Type', dbImage.contentType);

      return new Response(object.body, {
        headers
      });
    }
    return new Response('Not found', { status: 404 });
  }
  return new Response('Not found', { status: 404 });
};

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser({ context, request });
  const formData = await unstable_parseMultipartFormData(request, unstable_createMemoryUploadHandler());
  const image = formData.get('image') as File;

  const filePath = `${user.id}/profile-image`;
  const contentType = image.type;
  const size = image.size;

  if (size > 500000) {
    return json({ error: 'Image is too large', success: false });
  }

  await context.env.IMAGES.put(filePath, image);

  const dbImage = await db(context.env.DB)
    .insert(imageTable)
    .values({
      contentType,
      filePath,
      size,
      userId: user.id
    })
    .returning({ id: imageTable.id });

  await db(context.env.DB)
    .update(userTable)
    .set({ imageUrl: `/api/images/${dbImage[0].id}` })
    .where(eq(userTable.id, user.id));

  return json({ error: null, success: true });
}
