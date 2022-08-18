import type { CloudflareResponseBody } from 'vite-plugin-cloudflare-functions/worker';

import 'vite-plugin-cloudflare-functions/client';

declare module 'vite-plugin-cloudflare-functions/client' {
  interface APIParams {
    '/api/:msg': {
      msg: string;
    };
  }

  interface APIResponseBody {
    '/api/:msg': {
      GET: CloudflareResponseBody<typeof import('../functions/api/[msg]')['onRequestGet']>;
    };
  }
}

export {};
