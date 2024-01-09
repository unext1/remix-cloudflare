import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { zx } from 'zodix';
import { db } from '~/db/client.server';
import { workplaceTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser({ context, request });
  const { workplaceId } = await zx.parseForm(request, {
    workplaceId: z.string().min(1).transform(Number)
  });

  return await db(context.env.DB)
    .delete(workplaceTable)
    .where(and(eq(workplaceTable.userId, user.id), eq(workplaceTable.id, workplaceId)));
}
