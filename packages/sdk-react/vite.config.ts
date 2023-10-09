import { createViteConfig } from 'build-utils';

import packageJson from './package.json';

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  external: [
    '@tma.js/theme-params',
    '@tma.js/launch-params',
    '@tma.js/bridge',
    '@tma.js/sdk',
    'react',
  ],
  globals: {
    react: 'React',
  },
});
