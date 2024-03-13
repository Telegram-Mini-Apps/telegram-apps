import { createViteConfig, createVitestConfig } from 'build-utils';

import packageJson from './package.json';

function prefix(name: string): string {
  return `src/${name}`;
}

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  test: createVitestConfig({
    environment: 'happy-dom',
    coverage: {
      // TODO: As long as currently we are not covering all code in the project, we exclude some
      //  of the folders or files from the coverage. To be done in the future.
      exclude: [
        prefix('**/index.ts'),
        prefix('**/__tests__'),
        prefix('bridge/invokeCustomMethod.ts'),
        prefix('bridge/events/onTelegramEvent.ts'),
        prefix('components/back-button/BackButton.ts'),
        prefix('components/closing-behavior/ClosingBehavior.ts'),
        prefix('components/init-data/InitData.ts'),
        prefix('components/popup/preparePopupParams.ts'),
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
  tsconfigPath: './tsconfig.build.json',
});
