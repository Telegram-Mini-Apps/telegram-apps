import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      dts({ outDir: 'dist/dts' }),
      solidPlugin(),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
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
