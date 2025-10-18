import { defineConfig, type UserConfigFn } from 'vitest/config';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LibraryFormats } from 'vite';

import packageJson from '../package.json' with { type: 'json' };

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
  inlineModules?: boolean
}): UserConfigFn {
  return defineConfig(({ mode }) => {
    const tsconfigPath = mode === 'test'
      ? './tsconfig.test.json'
      : './tsconfig.build.json';

    return {
      plugins: [
        declarations && dts({ outDir: 'dist/dts', tsconfigPath }),
      ],
      resolve: {
        alias: {
          '@test-utils': resolve(dirname(fileURLToPath(import.meta.url)), '../test-utils'),
          '@': resolve(dirname(fileURLToPath(import.meta.url)), '../src'),
        },
      },
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        sourcemap: true,
        rollupOptions: {
          external: inlineModules ? [] : Object.keys(packageJson.dependencies),
        },
        lib: {
          name: 'tmajs.sdk',
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