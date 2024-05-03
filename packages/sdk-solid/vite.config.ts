import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';

import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
  return {
    plugins: [
      // Creates typescript declarations.
      // https://www.npmjs.com/package/vite-plugin-dts
      dts({ outDir: 'dist/dts', tsconfigPath: './tsconfig.build.json' }),
      solidPlugin(),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,

      rollupOptions: {
        input: 'src/index.ts',
        external: ['solid-js']
      },

      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName(format) {
          switch (format) {
            case 'cjs':
              return 'index.cjs';
            case 'es':
              return 'index.mjs';
            default:
              return 'index';
          }
        },
      },
    },
  };
});
