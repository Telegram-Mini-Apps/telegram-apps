import { defineConfig, UserConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import type { LibraryFormats } from 'vite';

export function getConfig({
  filename = 'index',
  input,
  formats,
  declarations = false,
}: {
  input: string;
  filename?: string;
  formats: LibraryFormats[];
  declarations?: boolean;
}): UserConfig {
  return defineConfig({
    plugins: [
      tsconfigPaths(),
      declarations && dts({ outDir: 'dist/dts' }),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      sourcemap: true,
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
  });
}