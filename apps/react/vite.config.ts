import { defineConfig, ServerOptions } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: getServerOptions()
});
