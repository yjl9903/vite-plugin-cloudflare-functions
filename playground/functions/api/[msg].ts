import { makePagesFunction, makeResponse } from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet = makePagesFunction(() => makeResponse({ status: 'OK', data: 'Hello' }));
