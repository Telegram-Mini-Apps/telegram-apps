import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const dir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths()],
  // Uncomment this line in case, you would like to run Vite dev server using HTTPS. In this case,
  // you will need correct certificate, private key and DNS configuration for your custom domain.
  // For this purpose you could use mkcert:
  // https://github.com/FiloSottile/mkcert
  server: {
    port: 443,
    https: {
      cert: readFileSync(resolve(dir, '../../https-cert.pem')),
      key: readFileSync(resolve(dir, '../../https-key.pem')),
    },
    host: 'tma.internal',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

