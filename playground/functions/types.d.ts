import 'vite-plugin-cloudflare-functions/worker';

declare module 'vite-plugin-cloudflare-functions/worker' {
  interface PagesFunctionEnv {}

  interface PagesFunctionData {}
}
