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

export function makeResponse<T = any>(body: T, init: ResponseInit = {}): CloudflareResponse<T> {
  return new CloudflareResponse(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers }
  });
}
