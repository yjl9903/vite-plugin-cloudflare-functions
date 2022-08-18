import * as path from 'node:path';
import { existsSync, promises as fs } from 'node:fs';

import { getDefaultTsconfig } from './template';

export async function prepare(root: string) {
  const internalRoot = path.join(root, '.cloudflare');
  if (!existsSync(internalRoot)) {
    await fs.mkdir(internalRoot);
  }

  const tsconfigPath = path.join(internalRoot, 'tsconfig.json');
  const tsconfig = getDefaultTsconfig();
  const tsconfigRaw = JSON.stringify(tsconfig, null, 2);
  if (existsSync(tsconfigPath)) {
    if ((await fs.readFile(tsconfigPath, 'utf-8')).trim() !== tsconfigRaw) {
      await fs.writeFile(tsconfigPath, tsconfigRaw, 'utf-8');
    }
  } else {
    await fs.writeFile(tsconfigPath, tsconfigRaw, 'utf-8');
  }
}
