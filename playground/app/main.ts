import now from '~build/time';

document.querySelector('#info')!.innerHTML = 'Build at: ' + now.toLocaleString();

const endpoint = '/api/world';

fetch(endpoint).then(async (data) => {
  document.querySelector('#app')!.innerHTML =
    `Receive from Pages Functions (${endpoint}): ` + (await data.text());
});
