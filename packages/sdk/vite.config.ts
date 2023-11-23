import { createViteConfig, createVitestConfig } from 'build-utils';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import packageJson from './package.json';

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  alias: {
    '~': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
  },
  test: createVitestConfig({
    environment: 'happy-dom',
  }),
});
