import { createUMDGlobals, createViteConfig, createVitestConfig } from 'build-utils';

import packageJson from './package.json';

const external = ['@tma.js/parsing'];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd', 'cjs'],
  external,
  globals: createUMDGlobals(external),
  test: createVitestConfig({
    coverage: {
      branches: 100,
      functions: 100,
      statements: 100,
      lines: 100,
    },
  }),
});
