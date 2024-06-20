// import { readFileSync } from 'node:fs';
// import { dirname, resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/solidjs-template/',
  plugins: [
    /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    tsconfigPaths(),
  ],
  // Uncomment the next lines in case, you would like to run Vite dev server using HTTPS and in case,
  // you have key and certificate. You retrieve your certificate and key using mkcert.
  // Learn more:
  // https://docs.telegram-mini-apps.com/platform/getting-app-link#mkcert
  //
  // server: {
  //   port: 443,
  //   https: {
  //     cert: readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), './tma.internal.pem')),
  //     key: readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), './tma.internal-key.pem')),
  //   },
  //   host: 'tma.internal',
  // },
  build: {
    target: 'esnext',
  },
  publicDir: './public'
});
