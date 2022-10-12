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

  wrangler?: {
    /**
     * Wrangler dev server port
     *
     * @default 8788
     */
    port?: number;

    /**
     * Enable wrangler log
     *
     * @default false
     */
    log?: boolean;

    /**
     * Bind variable/secret
     */
    binding?: Record<string, string>;

    /**
     * Bind KV namespace
     */
    kv?: string | string[];

    /**
     * Bind Durable Object
     */
    do?: Record<string, string>;

    /**
     * Bind R2 bucket
     */
    r2?: string | string[];
  };
}
