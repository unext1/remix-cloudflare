import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { zx } from 'zodix';
import { db } from '~/db/client.server';
import { imageTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser({ context, request });
  const { imageId } = await zx.parseForm(request, {
    imageId: z.string().min(1, 'Image ID is required').transform(Number)
  });

  return await db(context.env.DB)
    .delete(imageTable)
    .where(and(eq(imageTable.id, imageId), eq(imageTable.userId, Number(user.id))));
}
