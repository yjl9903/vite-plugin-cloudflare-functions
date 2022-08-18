import { makePagesFunction } from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet = makePagesFunction(({ params }) => ({
  status: 'OK',
  data: 'Hello, ' + params.msg + '!'
}));
