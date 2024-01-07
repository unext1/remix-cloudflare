import { type AppLoadContext, redirect } from '@remix-run/cloudflare';
import { and, eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import { db } from '~/db/client.server';
import { workplaceTable } from '~/db/schema';

export const getWorkplace = async ({
  userId,
  workplaceId,
  context
}: {
  userId: number;
  workplaceId: number;
  context: AppLoadContext;
}) => {
  const workplace = await db(context.env.DB).query.workplaceTable.findFirst({
    with: {
      owner: true
    },
    where: and(eq(workplaceTable.id, Number(workplaceId)), eq(workplaceTable.userId, Number(userId)))
  });

  if (workplace) {
    return workplace;
  } else {
    throw redirect($path('/app'));
  }
};
