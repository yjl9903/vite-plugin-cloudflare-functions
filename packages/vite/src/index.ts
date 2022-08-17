import type { Plugin } from 'vite';

import * as fs from 'node:fs';
import * as path from 'node:path';

import { normalizePath } from 'vite';

import type { UserConfig } from './types';

export default function CloudflarePagesFunctions(userConfig: UserConfig = {}): Plugin {
  let root: string;
  let functionsRoot: string;

  return {
    name: 'vite-plugin-cloudflare-functions',
    configResolved(resolvedConfig) {
      root = resolvedConfig.root;
      functionsRoot = normalizePath(
        !!userConfig.root
          ? path.resolve(userConfig.root)
          : path.resolve(resolvedConfig.root, 'functions')
      );
    },
    buildEnd() {
      if (userConfig.outDir) {
        const functionsDst = normalizePath(
          userConfig.outDir === true
            ? path.resolve(root, 'functions')
            : path.resolve(root, userConfig.outDir, 'functions')
        );

        console.log('[vite-plugin-cloudflare-functions] Copy functions directory...');
        console.log(
          `[vite-plugin-cloudflare-functions] From '${path.relative(
            '.',
            functionsRoot
          )}' to '${path.relative('.', functionsDst)}'`
        );

        try {
          fs.rmSync(functionsDst, { recursive: true });
          fs.cpSync(functionsRoot, functionsDst, { recursive: true });
        } catch {}

        console.log('[vite-plugin-cloudflare-functions] Copy finished.');
      }
    }
  };
}
