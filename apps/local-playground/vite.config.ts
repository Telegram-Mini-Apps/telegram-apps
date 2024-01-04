import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// TODO: Add docs link for getServerOptions.

/**
 * Returns Vite dev server options.
 */
// function getServerOptions(): ServerOptions {
//   const dir = dirname(fileURLToPath(import.meta.url));
//
//   return {
//     port: 443,
//     https: {
//       cert: readFileSync(resolve(dir, '../../https-cert.pem')),
//       key: readFileSync(resolve(dir, '../../https-key.pem')),
//     },
//     host: 'tma.internal',
//   };
// }

export default defineConfig({
  plugins: [tsconfigPaths()],
  // Uncomment this line in case, you would like to run Vite dev server using HTTPS. In this case,
  // you will need correct certificate, private key and DNS configuration for your custom domain.
  // For this purpose you could use mkcert:
  // https://github.com/FiloSottile/mkcert
  // server: getServerOptions(),
  server: {
    host: true,
  },
});

