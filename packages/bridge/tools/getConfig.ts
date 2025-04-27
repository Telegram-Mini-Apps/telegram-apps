import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type UserConfigFn } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import type { LibraryFormats } from 'vite';

export function getConfig({
  filename = 'index',
  input,
  formats,
  declarations,
  inlineModules,
}: {
  input: string;
  filename?: string;
  formats: LibraryFormats[];
  declarations?: boolean;
  inlineModules?: boolean;
}): UserConfigFn {
  return defineConfig(({ mode }) => {
    const tsconfigPath = mode === 'test'
      ? './tsconfig.test.json'
      : './tsconfig.build.json';

    return {
      plugins: [
        tsconfigPaths({ projects: [tsconfigPath] }),
        declarations && dts({ outDir: 'dist/dts', tsconfigPath }),
      ],
      resolve: {
        alias: {
          '@': resolve(dirname(fileURLToPath(import.meta.url)), '../src'),
        },
      },
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        sourcemap: true,
        rollupOptions: {
          external: inlineModules ? [] : [
            '@telegram-apps/signals',
            '@telegram-apps/toolkit',
            '@telegram-apps/transformers',
            '@telegram-apps/types',
            'valibot',
            'better-promises',
            'error-kid',
            'mitt'
          ],
        },
        lib: {
          name: 'tapps.bridge',
          entry: input,
          formats,
          fileName: filename,
        },
      },
      test: {
        environment: 'happy-dom',
        coverage: {
          enabled: true,
          provider: 'v8',
          include: ['src/**/*.ts'],
          exclude: ['src/**/*.test.ts'],
          branches: 80,
          functions: 80,
          statements: 80,
          lines: 80,
        },
      },
    };
  });
}