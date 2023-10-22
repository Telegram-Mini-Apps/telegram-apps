import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type ServerOptions } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// TODO: Add docs link for getServerOptions.

/**
 * Returns Vite dev server options.
 */
function getServerOptions(): ServerOptions {
  const dir = dirname(fileURLToPath(import.meta.url));

  return {
    port: 3000,
    https: {
      cert: readFileSync(resolve(dir, ' ../../https-cert.pem')),
      key: readFileSync(resolve(dir, ' ../../https-key.pem')),
    },
    host: 'tma.internal',
  };
}

export default defineConfig({
  plugins: [tsconfigPaths()],
  // Comment this line in case, you would like to run Vite dev server using HTTP. Otherwise,
  // it would be launched using HTTPS protocol.
  server: getServerOptions(),
});

