import { createViteConfig, createVitestConfig } from 'build-utils';

import packageJson from './package.json';

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  external: [
    '@tma.js/bridge',
    '@tma.js/colors',
    '@tma.js/init-data',
    '@tma.js/utils',
    '@tma.js/util-types',
    '@tma.js/parsing',
    '@tma.js/event-emitter',
    '@tma.js/theme-params',
    '@tma.js/launch-params',
  ],
  test: createVitestConfig({
    environment: 'happy-dom',
  }),
});
