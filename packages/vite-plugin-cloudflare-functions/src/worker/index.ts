import { CloudflareResponse, type CloudflarePagesFunction } from './types';

export { CloudflareResponse, type CloudflarePagesFunction };

export function makeResponse<T = any>(body: T, init: ResponseInit = {}): CloudflareResponse<T> {
  return new CloudflareResponse(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers }
  });
}
