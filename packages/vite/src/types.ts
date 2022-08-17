export interface UserConfig {
  /**
   * Cloudflare Functions root directory
   *
   * This directory is relative to the Vite root
   *
   * @default './functions'
   */
  root?: string;

  /**
   * Copy the functions directory to outDir
   *
   * When it is undefined, plugin will not copy the directory
   *
   * This directory is relative to the Vite root
   *
   * @default false
   */
  outDir?: string | boolean;

  /**
   * Filepath to generate corresponding .d.ts file
   *
   * @default './cloudflare.d.ts'
   */
  dts?: string | boolean;
}
