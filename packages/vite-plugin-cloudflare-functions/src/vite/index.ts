import type { Plugin } from 'vite';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { type Readable } from 'node:stream';
import { type ChildProcessByStdio, spawn } from 'node:child_process';

import kill from 'tree-kill';
import colors from 'picocolors';
import { onDeath } from '@breadc/death';

import type { UserConfig } from './types';

import { generate } from './generate';
import { normalizePath, debug } from './utils';

const DefaultPort = 5173;
const DefaultWranglerPort = 8788;

export function CloudflarePagesFunctions(userConfig: UserConfig = {}): Plugin {
  let root: string;
  let port: number;
  let functionsRoot: string;

  let preparePromise: Promise<void> | undefined;
  let wranglerProcess: ChildProcessByStdio<null, Readable, Readable> | undefined;
  let workerProcess: ChildProcessByStdio<null, Readable, Readable> | undefined;
  const killProcess = async () => {
    if (wranglerProcess) {
      const pid = wranglerProcess.pid;
      debug(`Kill wrangler (PID: ${pid})`);
      wranglerProcess = undefined;
      if (pid) {
        await new Promise((res) => kill(pid, () => res(undefined)));
      }
    }
    if (workerProcess) {
      const pid = workerProcess.pid;
      debug(`Kill wrangler (PID: ${pid})`);
      workerProcess = undefined;
      if (pid) {
        await new Promise((res) => kill(pid, () => res(undefined)));
      }
    }
  };
  onDeath(async () => {
    await killProcess();
  });

  if (typeof userConfig.dts !== 'boolean' && typeof userConfig.dts !== 'string') {
    userConfig.dts = true;
  }

  let shouldGen = false;
  const doAutoGen = async () => {
    if (userConfig.dts) {
      const dts = userConfig.dts === true ? 'cloudflare.d.ts' : userConfig.dts;
      const dtsPath = path.resolve(root, dts);
      const content = await generate(functionsRoot, path.dirname(dtsPath));
      if (content && content.length > 0) {
        await fs.promises.writeFile(dtsPath, content, 'utf-8');
      }
    }
  };

  async function startWrangler() {
    if (wranglerProcess) {
      await killProcess();
    }

    const wranglerPort = userConfig.wrangler?.port ?? DefaultWranglerPort;

    const bindings: string[] = [];
    if (userConfig.wrangler?.binding) {
      for (const [key, value] of Object.entries(userConfig.wrangler.binding)) {
        bindings.push('--binding');
        bindings.push(`${key}=${value}`);
      }
    }
    if (userConfig.wrangler?.kv) {
      const kvs = Array.isArray(userConfig.wrangler.kv)
        ? userConfig.wrangler.kv
        : [userConfig.wrangler.kv];
      for (const kv of kvs) {
        bindings.push('--kv');
        bindings.push(kv);
      }
    }
    if (userConfig.wrangler?.d1) {
      const d1s = Array.isArray(userConfig.wrangler.d1)
        ? userConfig.wrangler.d1
        : [userConfig.wrangler.d1];
      for (const d1 of d1s) {
        bindings.push('--d1');
        bindings.push(d1);
      }
    }
    if (userConfig.wrangler?.do) {
      for (const [key, value] of Object.entries(userConfig.wrangler.do)) {
        const config = typeof value === 'string' ? value : `${value.class}@${value.script}`;
        bindings.push('--do');
        bindings.push(`"${key}=${config}"`);
      }
    }
    if (userConfig.wrangler?.r2) {
      const r2s = Array.isArray(userConfig.wrangler.r2)
        ? userConfig.wrangler.r2
        : [userConfig.wrangler.r2];
      for (const r2 of r2s) {
        bindings.push('--r2');
        bindings.push(r2);
      }
    }
    if (userConfig.wrangler?.ai) {
      const ais = Array.isArray(userConfig.wrangler.ai)
        ? userConfig.wrangler.ai
        : [userConfig.wrangler.ai];

      for (const ai of ais) {
        bindings.push('--ai');
        bindings.push(ai);
      }
    }

    const persistTo = [];
    if (userConfig?.wrangler?.persistTo === undefined || userConfig?.wrangler?.persistTo === null) {
      persistTo.push('--persist-to', path.join(functionsRoot, '.wrangler/state'));
    } else {
      if (typeof userConfig?.wrangler?.persistTo === 'boolean' && userConfig?.wrangler?.persistTo) {
        persistTo.push('--persist-to', path.join(functionsRoot, '.wrangler/state'));
      } else if (typeof userConfig?.wrangler?.persistTo === 'string') {
        persistTo.push('--persist-to', userConfig?.wrangler?.persistTo);
      }
    }

    const command = [
      'wrangler',
      'pages',
      'dev',
      '--local',
      '--ip',
      'localhost',
      '--port',
      String(wranglerPort),
      '--proxy',
      String(port),
      ...persistTo,
      ...bindings
    ];

    const compatibilityDate = userConfig.wrangler?.compatibilityDate;
    if (compatibilityDate) {
      command.push('--compatibility-date');
      command.push(compatibilityDate);
    }

    debug(command);

    // Disable inherit http_prxoy or https_proxy env
    const wranglerEnv = { ...process.env };
    for (const key of ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy']) {
      if (key in wranglerEnv) {
        delete wranglerEnv[key];
      }
    }

    // Spawn process
    wranglerProcess = spawn('npx', command, {
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: wranglerEnv,
      cwd: path.dirname(functionsRoot)
    });

    let firstTime = true;
    wranglerProcess.stdout.on('data', (chunk) => {
      const text: string = chunk.toString('utf8').slice(0, -1);
      if (text.indexOf('Compiled Worker successfully') !== -1) {
        if (firstTime) {
          doAutoGen();
          firstTime = false;
          const colorUrl = (url: string) =>
            colors.cyan(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`));
          console.log(
            `  ${colors.green('➜')}  ${colors.bold('Pages')}:   ${colorUrl(
              `http://localhost:${wranglerPort}/`
            )}\n`
          );
        } else {
          shouldGen = true;
          console.log(
            `${colors.dim(new Date().toLocaleTimeString())} ${colors.cyan(
              colors.bold('[cloudflare pages]')
            )} ${colors.green('functions reload')}`
          );
        }
      }
      if (userConfig.wrangler?.log && text) {
        console.log(text);
      }
    });

    wranglerProcess.stderr.on('data', (chunk) => {
      if (userConfig.wrangler?.log) {
        const text = chunk.toString('utf8').slice(0, -1);
        console.error(text);
      }
    });

    if (userConfig.wrangler?.do) {
      const command = ['wrangler', 'dev', ...persistTo];
      if (compatibilityDate) {
        command.push(`--compatibility-date=${compatibilityDate}`);
      }

      workerProcess = spawn('npx', command, {
        shell: process.platform === 'win32',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: wranglerEnv,
        cwd: functionsRoot
      });

      workerProcess.stdout.on('data', (chunk) => {
        const text: string = chunk.toString('utf8').slice(0, -1);
        if (userConfig.wrangler?.log && text) {
          console.log(text);
        }
      });

      workerProcess.stderr.on('data', (chunk) => {
        const text = chunk.toString('utf8').slice(0, -1);
        if (userConfig.wrangler?.log && text) {
          console.error(text);
        }
      });
    }
  }

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

      debug(`Functions root: ${functionsRoot}`);

      if (!functionsRoot.endsWith('functions') && functionsRoot.endsWith('functions/')) {
        console.log('You should put your worker in directory named as functions/');
      }

      if (!preparePromise) {
        preparePromise = doAutoGen();
      }
    },
    async configureServer(_server) {
      if (userConfig.dts) {
        setInterval(async () => {
          if (shouldGen) {
            shouldGen = false;
            await doAutoGen();
          }
        }, 1000);
      }

      await startWrangler();
    },
    async closeBundle() {
      await killProcess();
    },
    renderStart() {
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
