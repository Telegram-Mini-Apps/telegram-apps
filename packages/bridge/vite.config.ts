import { createUMDGlobals, createViteConfig } from 'build-utils';

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
  formats: ['es', 'umd'],
  external,
  globals: createUMDGlobals(external),
});
