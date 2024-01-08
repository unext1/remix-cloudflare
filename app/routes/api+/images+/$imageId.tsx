import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { zx } from 'zodix';

import { db } from '~/db/client.server';
import { imageTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });

  const dbImage = await db(context.env.DB).query.imageTable.findFirst({
    where: and(eq(imageTable.id, Number(params.imageId)), eq(imageTable.userId, user.id))
  });

  if (dbImage) {
    const object = await context.env.IMAGES.get(dbImage.filePath);

    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      // Sutvarkyti
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
  const { imageId } = await zx.parseForm(request, {
    imageId: z.string().min(1, 'Image ID is required').transform(Number)
  });

  await db(context.env.DB)
    .delete(imageTable)
    .where(and(eq(imageTable.id, imageId), eq(imageTable.userId, user.id)));

  const referer = request.headers.get('referer');

  const url = new URL(referer || '/app');

  return redirect(url.pathname);
}
