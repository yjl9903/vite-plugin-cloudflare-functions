import { makePagesFunction } from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet = makePagesFunction(async ({ params, env }) => {
  const key = params.key as string;
  const value = await env.STORE.get(key);

  return {
    key,
    value
  };
});

export const onRequestPost = makePagesFunction(async ({ params, request, env }) => {
  const key = params.key as string;
  const value = await request.text();
  await env.STORE.put(key, value);

  return {
    key,
    value
  };
});
