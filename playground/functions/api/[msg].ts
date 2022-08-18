import { makeResponse } from 'vite-plugin-cloudflare-functions/server';

export const onRequestGet = () => makeResponse({ status: 'OK', data: 'Hello' });
