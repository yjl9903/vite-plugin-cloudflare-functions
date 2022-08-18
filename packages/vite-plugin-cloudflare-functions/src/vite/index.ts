import type { Plugin } from 'vite';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn } from 'node:child_process';

import colors from 'picocolors';
import { normalizePath } from 'vite';

import type { UserConfig } from './types';

import { prepare } from './prepare';
import { generate } from './generate';

export { prepare };

const DefaultPort = 5173;
const DefaultWranglerPort = 8788;

export function CloudflarePagesFunctions(userConfig: UserConfig = {}): Plugin {
  let root: string;
  let port: number;
  let functionsRoot: string;

  let preparePromise: Promise<void>;

  if (!userConfig.dts) {
    userConfig.dts = true;
  }

  let shouldGen = false;
  const doAutoGen = async () => {
    if (userConfig.dts) {
      const dts = userConfig.dts === true ? 'cloudflare.d.ts' : userConfig.dts;
      const dtsPath = path.resolve(root, dts);
      const content = await generate(functionsRoot, path.dirname(dtsPath));
      await fs.promises.writeFile(dtsPath, content, 'utf-8');
    }
  };

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
        console.log('You should put your worker in directory named as functions/');
      }

      preparePromise = prepare(functionsRoot);
      doAutoGen();
    },
    configureServer(_server) {
      if (userConfig.dts) {
        setInterval(async () => {
          if (shouldGen) {
            shouldGen = false;
            await doAutoGen();
          }
        }, 1000);
      }

      const wranglerPort = userConfig.wrangler?.port ?? DefaultWranglerPort;

      startWrangler();

      function startWrangler() {
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

        let firstTime = true;
        proxy.stdout.on('data', (chunk) => {
          const text: string = chunk.toString('utf8').slice(0, -1);
          if (text.indexOf('Worker reloaded!') !== -1) {
            if (firstTime) {
              doAutoGen();
              firstTime = false;
              const colorUrl = (url: string) =>
                colors.cyan(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`));
              console.log(
                `  ${colors.green('➜')}  ${colors.bold('Pages')}:   ${colorUrl(
                  `http://127.0.0.1:${wranglerPort}/`
                )}`
              );
            } else {
              shouldGen = true;
            }
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

        proxy.on('exit', () => {
          startWrangler();
        });
      }
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
