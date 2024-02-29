import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import type { LibraryFormats, PluginOption, UserConfig, AliasOptions } from 'vite';
import type { InlineConfig } from 'vitest';

import { formatTmaJSPackageName } from './formatTmaJSPackageName.js';

export interface CreateViteConfigOptions {
  /**
   * Alias options.
   */
  alias?: AliasOptions;

  /**
   * Should d.ts files be emitted.
   * @default true
   */
  declarations?: boolean;

  /**
   * Should Vite clear output directory.
   * @default true
   */
  emptyOutDir?: boolean;

  /**
   * External dependencies.
   */
  external?: string[];

  /**
   * Required package formats.
   */
  formats: LibraryFormats[];

  globals?: Record<string, string>;

  /**
   * NPM package name.
   */
  packageName: string;

  /**
   * Additional plugins.
   */
  plugins?: PluginOption[];

  /**
   * Test options.
   */
  test?: InlineConfig;

  /**
   * Path to tsconfig file.
   * @default './tsconfig.json'
   */
  tsconfigPath?: string;
}

export function createViteConfig(options: CreateViteConfigOptions): UserConfig {
  const {
    packageName,
    formats,
    external,
    globals,
    plugins = [],
    test,
    declarations = true,
    emptyOutDir = true,
    alias,
    tsconfigPath = './tsconfig.json'
  } = options;

  return {
    test,
    plugins: [
      tsconfigPaths(),
      // Creates typescript declarations.
      // https://www.npmjs.com/package/vite-plugin-dts
      declarations && dts({
        outDir: 'dist/dts',
        tsconfigPath,
      }),
      ...plugins,
    ],
    resolve: {
      alias,
    },
    build: {
      outDir: 'dist',
      emptyOutDir,

      rollupOptions: {
        input: 'src/index.ts',
        external,
        output: {
          globals,
        },
      },

      lib: {
        name: formatTmaJSPackageName(packageName),
        entry: 'src/index.ts',
        formats,
        fileName(format) {
          switch (format) {
            case 'cjs':
              return 'index.cjs';
            case 'es':
              return 'index.mjs';
            case 'iife':
              return 'index.iife.js';
            default:
              return 'index';
          }
        },
      },
    },
  };
}