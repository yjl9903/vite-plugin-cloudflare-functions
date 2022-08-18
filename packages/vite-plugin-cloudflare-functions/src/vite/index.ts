import type { Plugin } from 'vite';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn } from 'node:child_process';

import colors from 'picocolors';
import { normalizePath } from 'vite';

import type { UserConfig } from './types';

const DefaultPort = 5173;
const DefaultWranglerPort = 8788;

export function CloudflarePagesFunctions(userConfig: UserConfig = {}): Plugin {
  let root: string;
  let port: number;
  let functionsRoot: string;

  return {
    name: 'vite-plugin-cloudflare-functions',
    config(config) {
      return {
        server: {
          strictPort: true,
          hmr: {
            port: (config.server?.port ?? DefaultPort) + 1
          }
        }
      };
    },
    configResolved(resolvedConfig) {
      root = resolvedConfig.root;
      port = resolvedConfig.server.port ?? DefaultPort;
      functionsRoot = normalizePath(
        !!userConfig.root
          ? path.resolve(userConfig.root)
          : path.resolve(resolvedConfig.root, 'functions')
      );
      if (!functionsRoot.endsWith('functions') && functionsRoot.endsWith('functions/')) {
        console.log('Must in functions/');
      }
    },
    configureServer(_server) {
      const wranglerPort = userConfig.wrangler?.port ?? DefaultWranglerPort;

      const proxy = spawn(
        'npx',
        [
          'wrangler',
          'pages',
          'dev',
          '--experimental-enable-local-persistence',
          '--ip',
          'localhost',
          '--port',
          String(wranglerPort),
          '--proxy',
          String(port),
          '--',
          'npm',
          '--version'
        ],
        {
          shell: process.platform === 'win32',
          stdio: ['inherit', 'pipe', 'pipe'],
          env: {
            BROWSER: 'none',
            ...process.env
          },
          cwd: path.dirname(functionsRoot)
        }
      );
      proxy.stdout.on('data', (chunk) => {
        const text = chunk.toString('utf8').slice(0, -1);
        if (text.startsWith('[pages:inf] Listening on ')) {
          const colorUrl = (url: string) =>
            colors.cyan(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`));
          console.log(
            `  ${colors.green('➜')}  ${colors.bold('Pages')}:   ${colorUrl(
              `http://127.0.0.1:${wranglerPort}/`
            )}`
          );
        }
        if (userConfig.wrangler?.log && text) {
          console.log(text);
        }
      });
      proxy.stderr.on('data', (chunk) => {
        if (userConfig.wrangler?.log) {
          const text = chunk.toString('utf8').slice(0, -1);
          console.error(text);
        }
      });
    },
    buildEnd() {
      if (userConfig.outDir) {
        const functionsDst = normalizePath(
          userConfig.outDir === true
            ? path.resolve(root, 'functions')
            : path.resolve(root, userConfig.outDir, 'functions')
        );

        console.log(
          `Copying cloudflare functions directory from '${path.relative(
            '.',
            functionsRoot
          )}' to '${path.relative('.', functionsDst)}' ...`
        );

        try {
          fs.rmSync(functionsDst, { recursive: true });
        } catch {}

        try {
          fs.cpSync(functionsRoot, functionsDst, { recursive: true });
        } catch {}
      }
    }
  };
}
