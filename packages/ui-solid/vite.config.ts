import { createViteConfig } from 'build-utils';
import solidPlugin from 'vite-plugin-solid';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import packageJson from './package.json';

export default createViteConfig({
  packageName: packageJson.name,
  formats: ['es', 'cjs'],
  external: ['@tma.js/sdk', 'solid-js'],
  plugins: [solidPlugin()],
  alias: {
    '~': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
  },
});
