import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
  return {
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
      dts({ outDir: 'dist/dts', tsconfigPath: './tsconfig.json' }),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: { external: ['node:crypto', 'node:url'] },
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
