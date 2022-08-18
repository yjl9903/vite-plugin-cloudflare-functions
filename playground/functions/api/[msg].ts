import { makeResponse } from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet: CloudflarePagesFunction = () =>
  makeResponse({ status: 'OK', data: 'Hello' });
