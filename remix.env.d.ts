/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

type ObjectKeys<T> = T extends object
  ? (keyof T)[]
  : T extends number
  ? []
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Array<anxy> | string
  ? string[]
  : never;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}
