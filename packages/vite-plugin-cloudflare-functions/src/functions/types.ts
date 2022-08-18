/// <reference types="@cloudflare/workers-types" />

export type CloudflareResponse<T = any> = globalThis.Response;

export type CloudflarePagesFunction<
  T = unknown,
  Env = unknown,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (
  context: Parameters<PagesFunction<Env, Params, Data>>[0]
) => CloudflareResponse<T> | Promise<CloudflareResponse<T>>;
