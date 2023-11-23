import { createViteConfig, createVitestConfig } from 'build-utils';

import packageJson from './package.json';

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  test: createVitestConfig({
    environment: 'happy-dom',
    coverage: {
      branches: 100,
      functions: 100,
      statements: 100,
      lines: 100,
    },
  }),
});
