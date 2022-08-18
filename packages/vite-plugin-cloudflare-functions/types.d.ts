declare global {
  import type {
    CloudflareResponse as _CloudflareResponse,
    CloudflareResponseBody as _CloudflareResponseBody,
    CloudflarePagesFunction as _CloudflarePagesFunction
  } from './dist/worker';

  export type CloudflareResponse = _CloudflareResponse;

  export type CloudflareResponseBody = _CloudflareResponseBody;

  export type CloudflarePagesFunction = _CloudflarePagesFunction;
}
