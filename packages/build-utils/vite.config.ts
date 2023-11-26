import { defineConfig } from 'vite';

import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    // Creates typescript declarations.
    // https://www.npmjs.com/package/vite-plugin-dts
    dts({ tsconfigPath: 'tsconfig.json' }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index.js',
    },
  },
});