# vite-plugin-cloudflare-functions

[![CI](https://github.com/yjl9903/vite-plugin-cloudflare-functions/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/vite-plugin-cloudflare-functions/actions/workflows/ci.yml)

:construction: Work in progress.

Make Cloudflare Pages Functions works with Vite friendly.

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

## Configuration

```ts
import { defineConfig } from 'vite';

import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

export default defineConfig({
  plugins: [
    CloudflarePagesFunctions({
      // Cloudflare Functions root directory
      root: '../functions',
      // Copy the functions directory to outDir
      outDir: '../../',
      // Wrangler configuration
      wrangler: {
        // Wrangler dev server port
        port: 8788,
        // Enable wrangler log
        log: true
      }
    })
  ]
});
```

## License

MIT License © 2021 [XLor](https://github.com/yjl9903)
