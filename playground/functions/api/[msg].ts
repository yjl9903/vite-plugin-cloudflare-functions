import {
  makeRawPagesFunction,
  makePagesFunction,
  makeResponse
} from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet = makePagesFunction(({ params }) => ({
  status: 'OK',
  data: 'Hello, ' + params.msg + '!'
}));

export const onRequestPost = makeRawPagesFunction(({ params }) =>
  makeResponse({
    status: 'OK',
    data: 'Post ' + params.msg + ' OK!'
  })
);
