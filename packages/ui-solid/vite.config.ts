import { createViteConfig } from 'build-utils';
import solidPlugin from 'vite-plugin-solid';

import packageJson from './package.json';

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  external: ['solid-js'],
  plugins: [solidPlugin()],
});
