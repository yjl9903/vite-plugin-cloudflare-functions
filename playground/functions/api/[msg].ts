import { makeResponse } from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet = () => makeResponse({ status: 'OK', data: 'Hello' });
