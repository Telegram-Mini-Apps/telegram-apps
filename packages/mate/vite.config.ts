import { defineConfig } from 'vite';
import shebang from 'rollup-plugin-preserve-shebang';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    shebang({
      shebang: '#!/usr/bin/env node',
    }),
  ],
  build: {
    emptyOutDir: true,
    ssr: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
  },
});