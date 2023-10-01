import dts from 'vite-plugin-dts';
import type { LibraryFormats, UserConfig, PluginOption } from 'vite';

interface Options {
  /**
   * Required package formats.
   */
  formats: LibraryFormats[];
  /**
   * External dependencies.
   */
  external?: string[];
  globals?: Record<string, string>;
  /**
   * Additional plugins.
   */
  plugins?: PluginOption[];
  /**
   * NPM package name.
   */
  packageName: string;
  /**
   * Path to tsconfig.json.
   * @default "./tsconfig.build.json"
   */
  tsconfigPath?: string;
}

export function createViteConfig(options: Options): UserConfig {
  const {
    packageName,
    formats,
    tsconfigPath = './tsconfig.build.json',
    external,
    globals,
    plugins = [],
  } = options;

  return {
    plugins: [
      // Creates typescript declarations.
      // https://www.npmjs.com/package/vite-plugin-dts
      dts({
        outDir: 'dist/dts',
        tsconfigPath,
      }),
      ...plugins,
    ],
    build: {
      outDir: 'dist',

      rollupOptions: {
        external,
        output: {
          globals,
        },
      },

      // We want source maps to let other developers see the source code. Their bundlers will
      // automatically remove them if needed.
      sourcemap: true,

      lib: {
        name: packageName,
        entry: 'src/index.ts',
        formats,
        fileName: 'index',
      },
    },
  };
}