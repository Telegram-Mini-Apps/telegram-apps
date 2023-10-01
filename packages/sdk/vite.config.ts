import { createUMDGlobals, createViteConfig } from 'build-utils';

import packageJson from './package.json';

const external = [
  '@tma.js/bridge',
  '@tma.js/colors',
  '@tma.js/init-data',
  '@tma.js/utils',
  '@tma.js/util-types',
  '@tma.js/parsing',
  '@tma.js/event-emitter',
];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd'],
  external,
  globals: createUMDGlobals(external),
});
