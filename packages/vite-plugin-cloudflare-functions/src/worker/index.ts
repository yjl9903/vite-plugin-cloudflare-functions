import type { CloudflareResponse } from './types';

export function makeResponse<T = any>(body: T, init: ResponseInit = {}): CloudflareResponse<T> {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers }
  });
}
