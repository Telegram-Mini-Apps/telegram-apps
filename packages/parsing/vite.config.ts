import { createUMDGlobals, createViteConfig } from 'build-utils';

import packageJson from './package.json';

const external = ['@tma.js/util-types', '@tma.js/colors'];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd'],
  external,
  globals: createUMDGlobals(external),
});
