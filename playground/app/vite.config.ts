import { defineConfig } from 'vite';

import Info from 'vite-plugin-info';
import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

export default defineConfig({
  plugins: [
    Info(),
    CloudflarePagesFunctions({
      root: '../functions',
      outDir: '../../',
      wrangler: { log: true, kv: ['STORE'] }
    })
  ]
});
