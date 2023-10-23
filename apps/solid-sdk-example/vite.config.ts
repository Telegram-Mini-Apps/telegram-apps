import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type ServerOptions } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// import devtools from 'solid-devtools/vite';

// TODO: Add docs link for getServerOptions.

/**
 * Returns Vite dev server options.
 */
function getServerOptions(): ServerOptions {
  const dir = dirname(fileURLToPath(import.meta.url));

  return {
    port: 443,
    https: {
      cert: readFileSync(resolve(dir, '../../https-cert.pem')),
      key: readFileSync(resolve(dir, '../../https-key.pem')),
    },
    host: 'tma.internal',
  };
}

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  // Uncomment this line in case, you would like to run Vite dev server using HTTPS and in case,
  // you have key and certificate.
  // server: getServerOptions(),
  build: {
    target: 'esnext',
  },
});
