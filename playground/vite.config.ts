import { defineConfig } from 'vite';

import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

export default defineConfig({
  plugins: [CloudflarePagesFunctions({ outDir: '../' })]
});
