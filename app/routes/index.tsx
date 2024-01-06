import { conform, useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction
} from '@remix-run/cloudflare';
import { isRouteErrorResponse, useActionData, useLoaderData, useLocation, useRouteError } from '@remix-run/react';
import { z } from 'zod';

import { CustomForm } from '~/components/custom-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { H1, H4, P } from '~/components/ui/typography';
import { db } from '~/db/client.server';
import { todoTable } from '~/db/schema';
import { zodAction } from '~/utils/zod-action.server';

const schema = z.object({
  title: z.string(),
  task: z.string()
});

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export function action({ context, request }: ActionFunctionArgs) {
  return zodAction({
    request,
    context,
    schema,
    cb: async ({ data: { title, task } }) => {
      await db(context.env.DB).insert(todoTable).values({
        title,
        task
      });

      throw redirect('/');
    }
  });
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const todos = await db(context.env.DB).select().from(todoTable);

  const user = await context.session.isAuthenticated(request);

  return json({ todos, user });
}

export default function Index() {
  const { todos, user } = useLoaderData<typeof loader>();

  const lastSubmission = useActionData<typeof action>();

  const location = useLocation();

  const [form, { title, task }] = useForm({
    lastSubmission: lastSubmission?.conform ? lastSubmission.conform : undefined,
    onValidate: ({ formData }) => parse(formData, { schema }),
    constraint: getFieldsetConstraint(schema),
    shouldRevalidate: 'onBlur'
  });

  return (
    <div className="mx-auto container ">
      <pre className="text-white">{JSON.stringify(user, null, 4)}</pre>
      <CustomForm method="post" className="mt-10 space-y-4" {...form.props} key={location.key}>
        <div>
          <Label htmlFor={title.id}>Title</Label>
          <Input type="text" {...conform.input(title)} />
          {title.error && <p className="text-red-400 mt-2 uppercase text-sm">{title.error}</p>}
        </div>
        <div>
          <Label htmlFor={task.id}>Task</Label>
          <Input type="text" {...conform.input(task)} />
          {task.error && <p className="text-red-400 mt-2 uppercase text-sm">{task.error}</p>}
        </div>
        <div className="flex space-x-4 mb-12">
          <Button type="submit">Create</Button>
          <Button type="reset" variant="destructive">
            Reset
          </Button>
        </div>
      </CustomForm>

      <div className="grid grid-cols-4 gap-6">
        {todos.map((todo) => (
          <div className="bg-card p-4 rounded-2xl" key={todo.id}>
            <div className="flex justify-between">
              <H4>{todo.task}</H4>
              <Button variant="ghost">X</Button>
            </div>
            <P className="">{todo.title}</P>
            <P className="text-xs">{todo.createdAt}</P>
          </div>
        ))}
      </div>

      {/* <pre className="text-white">{JSON.stringify(todos, null, 2)}</pre> */}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
