import { defineConfig, LibraryFormats, UserConfigFn } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

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
}): UserConfigFn {
  return defineConfig(() => {
    const dir = dirname(fileURLToPath(import.meta.url));
    // const tsconfigPath = resolve(dir, '../tsconfig.json')

    return {
      plugins: [
        tsconfigPaths(),
        declarations && dts({ outDir: 'dist/dts' }),
      ],
      resolve: {
        alias: {
          '@/': resolve(dir, '../src/'),
        },
      },
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        sourcemap: true,
        lib: {
          name: 'tmajs.sdk',
          entry: input,
          formats,
          fileName(format) {
            switch (format) {
              case 'cjs':
                return `${filename}.cjs`;
              case 'es':
                return `${filename}.mjs`;
              case 'iife':
                return `${filename}.iife.js`;
              default:
                return filename;
            }
          },
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