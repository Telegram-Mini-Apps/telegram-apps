import { createViteConfig, createVitestConfig } from 'build-utils';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import packageJson from './package.json';

function prefix(name: string): string {
  return `src/${name}`;
}

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  alias: {
    '~': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
  },
  test: createVitestConfig({
    environment: 'happy-dom',
    coverage: {
      // TODO: As long as currently we are not covering all code in the project, we exclude some
      //  of the folders or files from the coverage. To be done in the future.
      exclude: [
        prefix('**/index.ts'),
        prefix('**/__tests__'),
        prefix('back-button/BackButton.ts'),
        prefix('bridge/invoke-custom-method.ts'),
        prefix('closing-behavior/ClosingBehavior.ts'),
        prefix('init-data/InitData.ts'),
        prefix('launch-params/launchParamsParser.ts'),
        prefix('launch-params/parseLaunchParams.ts'),
        prefix('launch-params/retrieveFromLocation.ts'),
        prefix('launch-params/retrieveFromPerformance.ts'),
        prefix('launch-params/retrieveLaunchData.ts'),
        prefix('launch-params/retrieveLaunchParams.ts'),
        prefix('launch-params/serializeLaunchParams.ts'),
        prefix('launch-params/storage.ts'),
        prefix('popup/preparePopupParams.ts'),
        prefix('state'),
        prefix('supports/createSupportsParamFunc.ts'),
        prefix('main-button/MainButton.ts'),
        prefix('mini-app/MiniApp.ts'),
        prefix('misc/isTMA.ts'),
        prefix('navigation/**'),
        prefix('theme-params/ThemeParams.ts'),
        prefix('theme-params/requestThemeParams.ts'),
        prefix('timeout/sleep.ts'),
        prefix('viewport/Viewport.ts'),
        prefix('viewport/requestViewport.ts'),
      ],
      branches: 100,
      functions: 100,
      statements: 100,
      lines: 100,
    },
  }),
  tsconfigPath: './tsconfig.build.json',
});
