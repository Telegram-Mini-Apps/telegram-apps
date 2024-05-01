import { defineConfig, LibraryFormats, UserConfigFn } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { createVitestConfig } from 'build-utils';

function prefix(name: string): string {
  return `../src/${name}`;
}

interface Options {
  input: string;
  filename: string;
  formats: LibraryFormats[];
  declarations: boolean;
}

export function getConfig({ filename, input, formats, declarations }: Options): UserConfigFn {
  return defineConfig((config) => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const tsconfigPath = config.mode === 'test'
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
        emptyOutDir: true,
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
      test: createVitestConfig({
        environment: 'happy-dom',
        coverage: {
          // TODO: As long as currently we are not covering all code in the project, we exclude some
          //  of the folders or files from the coverage. To be done in the future.
          exclude: [
            prefix('**/index.ts'),
            prefix('**/__tests__'),
            prefix('bridge/methods/invokeCustomMethod.ts'),
            prefix('components/BackButton'),
            prefix('components/ClosingBehavior/ClosingBehavior.ts'),
            prefix('components/InitData/InitData.ts'),
            prefix('components/Popup/preparePopupParams.ts'),
            prefix('components/main-button/MainButton.ts'),
            prefix('components/mini-app/MiniApp.ts'),
            prefix('components/theme-params/ThemeParams.ts'),
            prefix('components/theme-params/requestThemeParams.ts'),
            prefix('components/viewport/Viewport.ts'),
            prefix('components/viewport/requestViewport.ts'),
            prefix('init/creators/createRequestIdGenerator.ts'),
            prefix('launch-params/launchParamsParser.ts'),
            prefix('launch-params/parseLaunchParams.ts'),
            prefix('launch-params/retrieveFromLocation.ts'),
            prefix('launch-params/retrieveFromPerformance.ts'),
            prefix('launch-params/retrieveLaunchData.ts'),
            prefix('launch-params/retrieveLaunchParams.ts'),
            prefix('launch-params/serializeLaunchParams.ts'),
            prefix('launch-params/storage.ts'),
            prefix('state'),
            prefix('supports/createSupportsParamFunc.ts'),
            prefix('misc/isTMA.ts'),
            prefix('navigation/**'),
            prefix('timeout/sleep.ts'),
          ],
          branches: 100,
          functions: 100,
          statements: 100,
          lines: 100,
        },
      }),
    };
  });
}