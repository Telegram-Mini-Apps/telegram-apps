import { createUMDGlobals, createViteConfig, createVitestConfig } from 'build-utils';

import packageJson from './package.json';

const external = [
  '@tma.js/utils',
  '@tma.js/logger',
  '@tma.js/event-emitter',
  '@tma.js/colors',
  '@tma.js/parsing',
  '@tma.js/util-types',
];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd', 'cjs'],
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
