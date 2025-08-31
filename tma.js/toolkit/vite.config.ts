import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const tsconfigPath = mode === 'test'
    ? './tsconfig.test.json'
    : './tsconfig.build.json';

  return {
    plugins: [
      tsconfigPaths({ projects: [tsconfigPath] }),
      dts({ outDir: 'dist/dts', tsconfigPath }),
    ],
    resolve: {
      alias: {
        '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
    },
    test: {
      environment: 'happy-dom',
      coverage: {
        enabled: true,
        provider: 'v8',
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/index.ts'],
        branches: 80,
        functions: 80,
        statements: 80,
        lines: 80,
      },
    },
  };
});