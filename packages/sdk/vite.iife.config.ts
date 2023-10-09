import { createViteIIFEConfig } from 'build-utils';

import packageJson from './package.json';

export default createViteIIFEConfig({
  packageName: packageJson.name,
});
