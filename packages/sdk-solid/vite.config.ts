import { createUMDGlobals, createViteConfig } from 'build-utils';

import packageJson from './package.json';
import solidPlugin from 'vite-plugin-solid';

const external = ['@tma.js/utils', '@tma.js/sdk', 'solid-js'];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd', 'cjs'],
  external,
  globals: createUMDGlobals(external),
  plugins: [solidPlugin()],
});
