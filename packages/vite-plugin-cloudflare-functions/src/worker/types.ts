/// <reference types="@cloudflare/workers-types" />

export class CloudflareResponse<T = any> extends Response {}

export type CloudflareResponseBody<T> = T extends CloudflarePagesFunction<infer Resp>
  ? Awaited<Resp> extends CloudflareResponse<infer R>
    ? R
    : never
  : never;

export type CloudflarePagesFunction<
  T = unknown,
  Env = unknown,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: Parameters<PagesFunction<Env, Params, Data>>[0]) => T | Promise<T>;
