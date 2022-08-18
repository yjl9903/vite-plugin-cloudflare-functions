import { makeRawPagesFunction } from 'vite-plugin-cloudflare-functions/worker';

export const onRequest = makeRawPagesFunction(async ({ next }) => await next());
