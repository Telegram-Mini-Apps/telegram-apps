import { createUMDGlobals, createViteConfig } from 'build-utils';

import packageJson from './package.json';

const external = ['@tma.js/parsing'];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd'],
  external: ['@tma.js/parsing'],
  globals: createUMDGlobals(external),
});
