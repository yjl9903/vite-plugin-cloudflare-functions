import {
  CloudflareResponse,
  type CloudflareResponseBody,
  type CloudflarePagesFunction
} from './types';

export { CloudflareResponse, type CloudflareResponseBody, type CloudflarePagesFunction };

export interface PagesFunctionEnv {}

export interface PagesFunctionData extends Record<string, unknown> {}

export function makeRawPagesFunction<
  T = unknown,
  Env = PagesFunctionEnv,
  Params extends string = any,
  Data extends Record<string, unknown> = PagesFunctionData
>(
  fn: CloudflarePagesFunction<CloudflareResponse<T>, Env, Params, Data>
): CloudflarePagesFunction<CloudflareResponse<T>, Env, Params, Data> {
  return fn;
}

export function makePagesFunction<
  T = unknown,
  Env = PagesFunctionEnv,
  Params extends string = any,
  Data extends Record<string, unknown> = PagesFunctionData
>(
  fn: CloudflarePagesFunction<T, Env, Params, Data>
): CloudflarePagesFunction<CloudflareResponse<T>, Env, Params, Data> {
  return async (context) => makeResponse(await fn(context));
}

export function makeRawResponse<T extends BodyInit | null | undefined>(
  body: T,
  init: ResponseInit = {}
): CloudflareResponse<T> {
  // @ts-ignore
  return new CloudflareResponse(body, init);
}

export function makeResponse<T = any>(
  body: T,
  init: ResponseInit = {}
): CloudflareResponse<T extends CloudflareResponse<infer R> ? R : T> {
  if (body instanceof Response || body instanceof CloudflareResponse) {
    return body;
  } else {
    return new CloudflareResponse(JSON.stringify(body), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers }
    });
  }
}
