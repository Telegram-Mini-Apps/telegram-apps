import { defineConfig } from 'vite';
import shebang from 'rollup-plugin-preserve-shebang';

export default defineConfig({
  plugins: [
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