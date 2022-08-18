const endpoint = '/api/hello';

fetch(endpoint).then(async (data) => {
  document.write(`Receive from Pages Functions (${endpoint}): ` + (await data.text()));
});

export {};
