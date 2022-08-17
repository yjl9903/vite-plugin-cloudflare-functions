export interface UserConfig {
  /**
   * Cloudflare Functions root directory
   */
  root?: string;

  /**
   * Copy the functions directory to outDir
   *
   * When it is undefined, plugin will not copy the directory
   */
  outDir?: string | boolean;

  /**
   * Filepath to generate corresponding .d.ts file
   *
   * @default './cloudflare.d.ts'
   */
  dts?: string | boolean;
}
