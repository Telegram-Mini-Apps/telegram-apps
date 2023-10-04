import { createUMDGlobals, createViteConfig } from 'build-utils';

import packageJson from './package.json';

const external = [
  '@tma.js/theme-params',
  '@tma.js/launch-params',
  '@tma.js/bridge',
  '@tma.js/sdk',
  'react',
];

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'umd'],
  external,
  globals: {
    ...createUMDGlobals(external),
    react: 'React',
  },
});
