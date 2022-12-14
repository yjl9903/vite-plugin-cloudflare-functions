import * as path from 'node:path';
import { existsSync, promises as fs } from 'node:fs';

import { getDefaultTsconfig } from './template';

export async function prepare(root: string) {
  const internalRoot = path.join(root, '.cloudflare');
  if (!existsSync(internalRoot)) {
    await fs.mkdir(internalRoot);
  }

  async function diffWrite(name: string, content: string, override = true) {
    const file = path.join(internalRoot, name);
    if (existsSync(file)) {
      if (override && (await fs.readFile(file, 'utf-8')).trim() !== content.trim()) {
        await fs.writeFile(file, content, 'utf-8');
      }
    } else {
      await fs.writeFile(file, content, 'utf-8');
    }
  }

  await diffWrite('tsconfig.json', getDefaultTsconfig());

  // await diffWrite(path.join('../', DtsFilename), getFunctionsDts(), false);
}
