import { makeResponse } from 'vite-plugin-cloudflare-functions/utils';

export const onRequestGet = () => makeResponse({ status: 'OK', data: 'Hello' });
