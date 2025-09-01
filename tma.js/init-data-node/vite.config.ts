import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig((_) => ({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      branches: 100,
      functions: 100,
      statements: 100,
      lines: 100,
    },
  },
  plugins: [
    dts({ outDir: 'dist' }),
  ],
  build: {
    outDir: 'dist/entries',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      external: [
        'node:crypto',
        '@tma.js/transformers',
        '@tma.js/types',
        '@tma.js/toolkit',
        'error-kid',
      ],
    },
    lib: {
      entry: {
        node: 'src/entries/node.ts',
        web: 'src/entries/web.ts',
      },
      formats: ['es', 'cjs'],
      fileName(format, entry) {
        return `${entry}.${format === 'es' ? 'js' : 'cjs'}`;
      },
    },
  },
}));
