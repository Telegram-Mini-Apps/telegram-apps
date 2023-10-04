import { createUMDGlobals, createViteConfig, createVitestConfig } from 'build-utils';

import packageJson from './package.json';

const external = [
  '@tma.js/bridge',
  '@tma.js/colors',
  '@tma.js/init-data',
  '@tma.js/utils',
  '@tma.js/util-types',
  '@tma.js/parsing',
  '@tma.js/event-emitter',
  '@tma.js/theme-params',
  '@tma.js/launch-params',
];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd'],
  external,
  globals: createUMDGlobals(external),
  test: createVitestConfig({
    environment: 'happy-dom',
  }),
});
