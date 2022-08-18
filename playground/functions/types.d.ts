/// <reference types="@cloudflare/workers-types" />

declare type CloudflareResponse<T = any> = globalThis.Response;

declare type CloudflarePagesFunction<
  T = unknown,
  Env = unknown,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (
  context: Parameters<PagesFunction<Env, Params, Data>>[0]
) => CloudflareResponse<T> | Promise<CloudflareResponse<T>>;
