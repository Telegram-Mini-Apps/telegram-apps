import { createViteConfig } from 'build-utils';

import packageJson from './package.json';

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es'],
});
