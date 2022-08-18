import { useFunctions } from 'vite-plugin-cloudflare-functions/client';

import now from '~build/time';

document.querySelector('#info')!.innerHTML = 'Build at: ' + now.toLocaleString();

const client = useFunctions();

const endpoint = '/api/world';

client.get(endpoint).then((resp) => {
  document.querySelector(
    '#app'
  )!.innerHTML = `Receive message from Pages Functions (${endpoint}): "${resp.data}"`;
});
