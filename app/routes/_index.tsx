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
      <CustomForm method="post" className="mt-10" {...form.props} key={location.key}>
        <label htmlFor={title.id} className="block text-xs mb-0.5 mt-2 uppercase font-semibold leading-6 text-gray-400">
          Title
        </label>
        <input type="text" {...conform.input(title)} />
        {title.error && <p className="text-red-400 mt-2 uppercase text-sm">{title.error}</p>}
        <label htmlFor={task.id} className="block text-xs mb-0.5 mt-2 uppercase font-semibold leading-6 text-gray-400">
          Task
        </label>
        <input type="text" {...conform.input(task)} />
        {task.error && <p className="text-red-400 mt-2 uppercase text-sm">{task.error}</p>}
        <div className="flex space-x-4 mb-12">
          <button
            type="submit"
            className="relative mt-8 py-2 px-6 bg-blue-400 rounded-xl text-white transition hover:bg-blue-500"
          >
            Create
          </button>
          <button
            type="reset"
            className="relative mt-8 py-2 px-6 bg-red-400 rounded-xl text-white transition hover:bg-red-500"
          >
            Reset
          </button>
        </div>
      </CustomForm>

      <div className="grid grid-cols-4 gap-6">
        {todos.map((todo) => (
          <div className="bg-slate-900 text-white p-4 rounded-2xl" key={todo.id}>
            <div className="flex justify-between mb-2">
              <h1 className="uppercase text-lg font-semibold my-auto">{todo.task}</h1>
              <button className="bg-red-500 text-white py-1 px-2 rounded-xl my-auto text-sm font-semibold">X</button>
            </div>
            <p className="text-slate-300">{todo.title}</p>
            <p className="mt-4 text-xs text-slate-400">{todo.createdAt}</p>
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
