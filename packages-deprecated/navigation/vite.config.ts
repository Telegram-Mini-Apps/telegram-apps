import { createViteConfig, createVitestConfig } from 'build-utils';

import packageJson from './package.json';

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  external: Object.keys(packageJson.dependencies),
  test: createVitestConfig({
    environment: 'happy-dom',
    // TODO: Uncomment, when more tests are ready.
    // coverage: {
    //   branches: 100,
    //   functions: 100,
    //   statements: 100,
    //   lines: 100,
    // },
  }),
});
