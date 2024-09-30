import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  base: '/solidjs-template',
  plugins: [
    // Uncomment the following line to enable solid-devtools.
    // For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    // devtools(),
    solidPlugin(),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
    // Allows using self-signed certificates to run the dev server using HTTPS.
    // https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
    basicSsl(),
  ],
  build: {
    target: 'esnext',
  },
  publicDir: './public',
  server: {
    // Uncomment this line if you want to expose your dev server and access it from the devices
    // in the same network.
    host: true,
  },
});
