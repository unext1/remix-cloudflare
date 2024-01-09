import { conform, useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, Link, useActionData, useLoaderData, useLocation } from '@remix-run/react';
import { $path } from 'remix-routes';
import { z } from 'zod';
import { CustomForm } from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { H4, P } from '~/components/ui/typography';
import { db } from '~/db/client.server';
import { workplaceTable } from '~/db/schema';
import { requireUser } from '~/services/auth.server';
import { zodAction } from '~/utils/zod-action.server';

const schema = z.object({
  name: z.string(),
  userId: z.number()
});

export function action({ context, request }: ActionFunctionArgs) {
  return zodAction({
    request,
    context,
    schema,
    cb: async ({ data: { name, userId } }) => {
      const workplace = await db(context.env.DB)
        .insert(workplaceTable)
        .values({
          name,
          userId
        })
        .returning({
          id: workplaceTable.id
        });

      throw redirect($path('/app/workplace/:workplaceId', { workplaceId: workplace[0].id }));
    }
  });
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await requireUser({ request, context });
  return json({ user });
};

const AppPage = () => {
  const { user } = useLoaderData<typeof loader>();

  const lastSubmission = useActionData<typeof action>();

  const location = useLocation();

  const [form, { name, userId }] = useForm({
    lastSubmission: lastSubmission?.conform ? lastSubmission.conform : undefined,
    onValidate: ({ formData }) => parse(formData, { schema }),
    constraint: getFieldsetConstraint(schema),
    shouldRevalidate: 'onBlur'
  });
  return (
    <div>
      <pre>{JSON.stringify(user, null, 4)}</pre>
      <h1>Workplaces</h1>
      <div className="grid grid-cols-4 gap-4">
        {user.workplaces.map((workplace) => (
          <div className="bg-card p-4 rounded-xl" key={workplace.id}>
            <div className="flex justify-between">
              <H4>{workplace.name}</H4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    X
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Remove Workplace</DialogTitle>
                    <DialogDescription>
                      Are you really really sure you want to delete {workplace.name} workplace ?
                    </DialogDescription>
                  </DialogHeader>
                  <CustomForm method="delete" action={$path('/api/workplace')} navigate={false}>
                    <Input type="hidden" name="workplaceId" value={workplace.id} />
                    <Button type="submit" variant="destructive">
                      Remove Workplace
                    </Button>
                  </CustomForm>
                </DialogContent>
              </Dialog>
            </div>
            <P className="text-sm">{workplace.createdAt}</P>
            <P className="text-xs">{user.name}</P>
            <Button asChild variant="secondary" className="w-full mt-4">
              <Link to={$path('/app/workplace/:workplaceId', { workplaceId: Number(workplace.id) })}>
                Knock Knock...
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="mt-6">
            Create Workplace
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Workplace</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>

          <CustomForm method="post" className="grid gap-4 py-4" {...form.props} key={location.key}>
            <div className="grid grid-cols-6 items-center gap-4">
              <Input {...conform.input(userId)} type="hidden" value={user.id} />
              <Label htmlFor={name.id} className="text-right col-span-2 text-sm whitespace-nowrap w-fit">
                Workplace Name
              </Label>
              <Input {...conform.input(name)} placeholder="Workplace Name" className="col-span-4" />
              {name.error && <p className="text-red-400 mt-2 uppercase text-sm">{name.error}</p>}
            </div>
            <Button type="submit">Save changes</Button>
          </CustomForm>
        </DialogContent>
      </Dialog>

      <Form method="post" className="mt-6" action={$path('/auth/logout')}>
        <Button variant="destructive">Logout</Button>
      </Form>
    </div>
  );
};

export default AppPage;
