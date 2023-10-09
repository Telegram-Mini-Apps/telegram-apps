import dts from 'vite-plugin-dts';
import type { LibraryFormats, PluginOption, UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

import { formatTmaJSPackageName } from './formatTmaJSPackageName.js';

export interface CreateViteConfigOptions {
  /**
   * Should d.ts files be emitted.
   * @default true
   */
  declarations?: boolean;

  /**
   * External dependencies.
   */
  external?: string[];

  /**
   * Should Vite clear output directory.
   * @default true
   */
  emptyOutDir?: boolean;

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
  } = options;

  return {
    test,
    plugins: [
      // Creates typescript declarations.
      // https://www.npmjs.com/package/vite-plugin-dts
      declarations && dts({
        outDir: 'dist/dts',
        tsconfigPath: './tsconfig.build.json',
      }),
      ...plugins,
    ],
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

      // We want source maps to let other developers see the source code. Their bundlers will
      // automatically remove sourcemaps if needed.
      sourcemap: true,

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