declare global {
  import type {
    CloudflareResponse as _CloudflareResponse,
    CloudflarePagesFunction as _CloudflarePagesFunction
  } from './dist/worker';

  export type CloudflareResponse = _CloudflareResponse;

  export type CloudflarePagesFunction = _CloudflarePagesFunction;
}
