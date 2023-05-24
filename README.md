# vite-plugin-cloudflare-functions

[![version](https://img.shields.io/npm/v/vite-plugin-cloudflare-functions?color=rgb%2850%2C203%2C86%29&label=npm)](https://www.npmjs.com/package/vite-plugin-cloudflare-functions) [![CI](https://github.com/yjl9903/vite-plugin-cloudflare-functions/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/vite-plugin-cloudflare-functions/actions/workflows/ci.yml) [![miki](https://img.shields.io/endpoint?url=https://pages.onekuma.cn/project/vite-plugin-cloudflare-functions&label=Demo)](https://vite-plugin-cloudflare-functions.pages.dev/)

Make [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/) works with Vite friendly.

> **Note**
>
> Cloudflare Pages Functions is currently in beta stage.

## Features

+ **Dev**: Automatically start wrangler pages dev server
+ **Dev**: Automatically generate functions API type declaration
+ **Build**: Automatically move the functions source directory

## Installation

```bash
npm i -D vite-plugin-cloudflare-functions
```

```ts
// vite.config.ts

import { defineConfig } from 'vite';

import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

export default defineConfig({
  plugins: [
    CloudflarePagesFunctions()
  ]
});
```

## Usage

### Functions

Just write pages functions as usual, but you should use the following utility functions to make auto-generation work.

+ `makePagesFunction`
+ `makeRawPagesFunction`
+ `makeResponse`
+ `makeRawResponse`

```ts
// /api/[msg].ts

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
```

#### Override environment

For example, you have set the environment variable `PASS` (you can config it in the plugin option, see [Configuration](#configuration)).

```ts
// cloudflare.d.ts

/// <reference types="@cloudflare/workers-types" />
/// <reference types="vite-plugin-cloudflare-functions/types" />

import 'vite-plugin-cloudflare-functions/worker';

declare module 'vite-plugin-cloudflare-functions/worker' {
  interface PagesFunctionEnv {
    PASS: string;
  }

  interface PagesFunctionData {}
}
```

Then you can find the parameter `env` has corresponding type declarations.

```ts
// /api/index.ts

import { makePagesFunction } from 'vite-plugin-cloudflare-functions/worker';

export const onRequestGet = makePagesFunction(({ env }) => ({
  pass: env.PASS
}));
```

### Client

We generate the API endpoint response body type declarations automatically, so that with the provided client `useFunctions` (powered by [axios](https://github.com/axios/axios)), your IDE will provide smarter IntelliSense.

```ts
// /main.ts
import { useFunctions } from 'vite-plugin-cloudflare-functions/client';

const client = useFunctions();

client.get('/api/world').then((resp) => {
  // The type of resp is { status: string, data: string }
});
```

Full example is [here](./playground/).

## Configuration

```ts
// vite.config.ts

import { defineConfig } from 'vite';

import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

export default defineConfig({
  plugins: [
    CloudflarePagesFunctions({
      // Cloudflare Functions root directory
      root: './functions',
      // Copy the functions directory to outDir or do nothing
      outDir: undefined,
      // Generate API type declarations
      dts: './cloudflare.d.ts',
      // Wrangler configuration
      wrangler: {
        // Wrangler dev server port
        port: 8788,
        // Enable wrangler log
        log: true,
        // Bind variable/secret
        binding: {},
        // Bind KV namespace
        kv: [],
        // Bind Durable Object
        do: {},
        // Bind R2 bucket
        r2: []
      }
    })
  ]
});
```

> **Note**
>
> The configuration field `binding`, `kv`, `do`, `d1`, `r2` are passed to run the command `wrangler pages dev` to start pages dev server. You can find more information about this command at [Commands - Cloudflare Worker docs](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1).

## License

MIT License © 2022 [XLor](https://github.com/yjl9903)
