import { type Submission } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { type AppLoadContext } from "@remix-run/cloudflare";
import { type z } from "zod";

export type TypedZodObejct<T> = Partial<Record<keyof T, any>>;

type ZodActionProps<T extends z.ZodSchema> = {
  request: Request;
  schema: T;
  context: AppLoadContext;
  cb: ({ data }: { data: z.infer<T> }) => Promise<void>;
};

type ZodActionReturn<T extends z.ZodSchema> =
  | {
      success: false;
      error: Record<keyof z.infer<T>, string> | undefined;
      conform: Submission<z.output<T>> | undefined;
    }
  | undefined;

export const zodAction = async <T extends z.ZodSchema>({
  request,
  context,
  schema,
  cb,
}: ZodActionProps<T>): Promise<ZodActionReturn<T>> => {
  await context.csrf.validate(request.clone());

  try {
    const formData = await request.formData();
    const result = parse(formData, { schema });

    if (Object.keys(result.error).length > 0) {
      const errorMap = Object.fromEntries(
        Object.entries(result.error).map(([key, value]) => [
          key,
          typeof value === "string" ? value : value[0],
        ])
      ) as Record<keyof z.infer<T>, string>;

      return {
        success: false,
        error: errorMap,
        conform: result,
      } as const;
    }

    await cb({ data: { ...result.value } });
  } catch (error) {
    throw error;
  }
};
