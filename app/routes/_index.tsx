import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { db } from "~/db/client.server";
import { todoTable } from "~/db/schema";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ context, request }: ActionFunctionArgs) {
  const { title, task } = await zx.parseForm(request, {
    title: z.string(),
    task: z.string(),
  });

  try {
    const todo = await db(context.env.DB).insert(todoTable).values({
      title,
      task,
    });

    return json(todo);
  } catch (e: any) {
    console.log({
      message: e.message,
      cause: e.cause.message,
    });
  }
  return {};
}

export async function loader({ context }: LoaderFunctionArgs) {
  try {
    const todos = await db(context.env.DB).select().from(todoTable);

    return json(todos);
  } catch (e: any) {
    console.log({
      message: e.message,
      cause: e.cause.message,
    });
  }
  return {};
}

export default function Index() {
  const todos = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto container ">
      <Form method="post" className="mt-10">
        <label className="block text-xs mb-0.5 mt-2 uppercase font-semibold leading-6 text-gray-400">
          Title
        </label>
        <input
          type="text"
          name="title"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none px-4 focus:ring-blue-400 sm:text-sm sm:leading-6"
        />
        <label className="block text-xs mb-0.5 mt-2 uppercase font-semibold leading-6 text-gray-400">
          Task
        </label>
        <input
          type="text"
          name="task"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none px-4 focus:ring-blue-400 sm:text-sm sm:leading-6"
        />
        <button
          type="submit"
          className="relative mt-8 py-2 px-6 w-full bg-blue-400 rounded-xl text-white transition hover:bg-blue-500"
        >
          Create
        </button>
      </Form>

      <pre className="text-white">{JSON.stringify(todos, null, 2)}</pre>
    </div>
  );
}
