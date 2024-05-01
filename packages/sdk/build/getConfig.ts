import { defineConfig, LibraryFormats, UserConfigFn } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

interface Options {
  input: string;
  filename: string;
  formats: LibraryFormats[];
  declarations: boolean;
}

export function getConfig({ filename, input, formats, declarations }: Options): UserConfigFn {
  return defineConfig((config) => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const test = config.mode === 'test';
    const tsconfigPath = test
      ? resolve(dir, '../tsconfig.json')
      : resolve(dir, '../tsconfig.build.json');

    return {
      plugins: [
        tsconfigPaths({ projects: [tsconfigPath] }),
        declarations && dts({ outDir: 'dist/dts', tsconfigPath }),
      ],
      resolve: {
        alias: {
          '@/': resolve(dir, '../src/'),
        },
      },
      build: {
        outDir: 'dist',
        emptyOutDir: false,
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