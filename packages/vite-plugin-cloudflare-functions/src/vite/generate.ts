import * as path from 'node:path';
import { promises as fs } from 'node:fs';

import fg from 'fast-glob';
import { findExportNames } from 'mlly';

import { normalizePath } from './utils';

export async function generate(functionsRoot: string, dtsPath: string) {
  const files = (
    await fg(['**/*.ts', '**/*.js', '!**/*.d.ts', '!node_modules/**/*'], {
      cwd: functionsRoot
    })
  ).sort();

  const removeSuffix = (file: string) => file.replace(/\.\w+$/, '');
  const ensureRoute = (file: string) => {
    file = removeSuffix(file);
    if (file.endsWith('_middleware')) {
      file = file.replace(/_middleware$/, '**');
    }
    if (!file.startsWith('/')) {
      file = '/' + file;
    }
    if (file.endsWith('/index')) {
      file = file.replace(/index$/, '');
    }
    file = file.replace(/\[\[([\w]+)\]\]$/g, '**:$1');
    file = file.replace(/\[([\w]+)\]/g, ':$1');
    return file;
  };

  const routes = await Promise.all(
    files.map(async (f) => {
      const absPath = path.join(functionsRoot, f);
      const exports = await getExports(absPath);

      if (exports.length > 0) {
        const route = ensureRoute(f);
        return [
          `'${route}': {`,
          ...exports.map((name) => {
            const method = name.slice().slice(9).toUpperCase();
            const realpath = normalizePath(path.relative(dtsPath, removeSuffix(absPath)));

            return (
              '  ' +
              `${
                !!method ? method : 'ALL'
              }: CloudflareResponseBody<typeof import('${realpath}')['${name}']>;`
            );
          }),
          `};`
        ].map((t) => '    ' + t);
      } else {
        return [];
      }
    })
  );
  const lines = routes.flat();

  if (lines.length === 0) return '';

  return [
    `import type { CloudflareResponseBody } from 'vite-plugin-cloudflare-functions/worker';\n`,
    `import 'vite-plugin-cloudflare-functions/client';\n`,
    `declare module 'vite-plugin-cloudflare-functions/client' {`,
    `  interface PagesResponseBody {`,
    ...lines,
    `  }`,
    `}\n`
  ].join('\n');
}

const ALLOW_EXPORTS = new Map([
  ['onRequest', 0],
  ['onRequestGet', 1],
  ['onRequestHead', 2],
  ['onRequestPost', 3],
  ['onRequestPut', 4],
  ['onRequestDelete', 5],
  ['onRequestOptions', 6],
  ['onRequestPatch', 7]
]);

async function getExports(filepath: string) {
  const code = await fs.readFile(filepath, 'utf-8');
  const exports = findExportNames(code);
  return exports
    .filter((n) => ALLOW_EXPORTS.has(n))
    .sort((a, b) => ALLOW_EXPORTS.get(a)! - ALLOW_EXPORTS.get(b)!);
}
