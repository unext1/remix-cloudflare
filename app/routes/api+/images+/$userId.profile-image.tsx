import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json
} from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';

import { db } from '~/db/client.server';
import { userTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const object = await context.env.IMAGES.get(`${params.userId}/profile-image`);

  if (object) {
    const contentType = object?.httpMetadata?.contentType;
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    return new Response(object.body, {
      headers
    });
  }
  return new Response('Not found', { status: 404 });
};

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser({ context, request });
  const formData = await unstable_parseMultipartFormData(request, unstable_createMemoryUploadHandler());
  const image = formData.get('image') as File;

  const filePath = `${user.id}/profile-image`;
  const size = image.size;

  if (size > 500000) {
    return json({ error: 'Image is too large', success: false });
  }

  await context.env.IMAGES.put(filePath, image);

  const now = new Date();

  const timestamp = now.getTime();

  await db(context.env.DB)
    .update(userTable)
    .set({ imageUrl: `/api/images/${user.id}/profile-image?v=${timestamp}` })
    .where(eq(userTable.id, user.id));

  return json({ error: null, success: true });
}
