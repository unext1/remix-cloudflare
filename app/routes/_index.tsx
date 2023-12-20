import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import {
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useLocation,
  useRouteError,
} from "@remix-run/react";
import { z } from "zod";
import { CustomForm } from "~/components/custom-form";
import { db } from "~/db/client.server";
import { todoTable } from "~/db/schema";
import { zodAction } from "~/utils/zod-action.server";

const schema = z.object({
  title: z.string(),
  task: z.string(),
});

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ context, request }: ActionFunctionArgs) {
  return zodAction({
    request,
    context,
    schema,
    cb: async ({ data: { title, task } }) => {
      await db(context.env.DB).insert(todoTable).values({
        title,
        task,
      });

      throw redirect("/");
    },
  });
}

export async function loader({ context }: LoaderFunctionArgs) {
  const todos = await db(context.env.DB).select().from(todoTable);

  return json(todos);
}

export default function Index() {
  const todos = useLoaderData<typeof loader>();

  const lastSubmission = useActionData<typeof action>();

  const location = useLocation();

  const [form, { title, task }] = useForm({
    lastSubmission: lastSubmission?.conform
      ? lastSubmission.conform
      : undefined,
    onValidate: ({ formData }) => parse(formData, { schema }),
    constraint: getFieldsetConstraint(schema),
    shouldRevalidate: "onBlur",
  });

  return (
    <div className="mx-auto container ">
      <CustomForm
        method="post"
        className="mt-10"
        {...form.props}
        key={location.key}
      >
        <label className="block text-xs mb-0.5 mt-2 uppercase font-semibold leading-6 text-gray-400">
          Title
        </label>
        <input type="text" {...conform.input(title)} />
        {title.error && (
          <p className="text-red-400 mt-2 uppercase text-sm">{title.error}</p>
        )}
        <label className="block text-xs mb-0.5 mt-2 uppercase font-semibold leading-6 text-gray-400">
          Task
        </label>
        <input type="text" {...conform.input(task)} />
        {task.error && (
          <p className="text-red-400 mt-2 uppercase text-sm">{task.error}</p>
        )}
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

      <pre className="text-white">{JSON.stringify(todos, null, 2)}</pre>
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
