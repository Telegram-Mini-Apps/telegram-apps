import { defineConfig } from 'vite';

export default defineConfig({
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