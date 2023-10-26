import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import Info from 'vite-plugin-info';
import Inspect from 'vite-plugin-inspect';
import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

import { Unocss } from '@onekuma/vite';

export default defineConfig({
  plugins: [
    vue(),
    Unocss(),
    Info(),
    Inspect(),
    CloudflarePagesFunctions({
      root: '../functions',
      outDir: '../../',
      wrangler: {
        log: true,
        compatibilityDate: '2023-10-26',
        kv: 'STORE',
        binding: { USER: 'yjl9903' },
        do: { COUNTER: { class: 'Counter', script: 'index' } }
      }
    })
  ]
});
