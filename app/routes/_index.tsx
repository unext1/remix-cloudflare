import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { z } from "zod";
import { zx } from "zodix";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const { title, task } = await zx.parseForm(request, {
    title: z.string().email(),
    task: z.string().min(6),
  });
  console.log(title, task);
}

export async function loader({ context }: LoaderFunctionArgs) {
  return {};
}

export default function Index() {
  return (
    <div>
      <h1>hi</h1>
    </div>
  );
}
