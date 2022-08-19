import { win32, posix } from 'node:path';

import createDebug from 'debug';

export const debug = createDebug('cloudflare-functions');

export function normalizePath(filename: string) {
  return filename.split(win32.sep).join(posix.sep);
}
