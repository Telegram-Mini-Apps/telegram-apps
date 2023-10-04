import { createUMDGlobals, createViteConfig, createVitestConfig } from 'build-utils';

import packageJson from './package.json';

const external = ['@tma.js/parsing', '@tma.js/init-data', '@tma.js/theme-params'];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd'],
  external,
  globals: createUMDGlobals(external),
  test: createVitestConfig({
    environment: 'happy-dom',
    coverage: {
      branches: 100,
      functions: 100,
      statements: 100,
      lines: 100,
    },
  }),
});
