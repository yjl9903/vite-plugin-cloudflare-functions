import {
  makeRawPagesFunction,
  makePagesFunction,
  makeResponse
} from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet = makePagesFunction(({ params, env }) => {
  return {
    status: 'OK',
    data: 'Hello, ' + params.msg + '!',
    env
  };
});

export const onRequestPost = makeRawPagesFunction(({ params }) =>
  makeResponse({
    status: 'OK',
    data: 'Post ' + params.msg + ' OK!'
  })
);
