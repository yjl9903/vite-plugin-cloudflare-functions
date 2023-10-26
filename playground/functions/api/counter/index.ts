import { makePagesFunction } from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet = makePagesFunction(async ({ request, env }) => {
  const id = env.COUNTER.idFromName('root');
  const counter = env.COUNTER.get(id);

  console.log(id, counter);

  const url = new URL(request.url);
  const resp = await counter.fetch(url.origin);

  return { value: await resp.text() };
});
