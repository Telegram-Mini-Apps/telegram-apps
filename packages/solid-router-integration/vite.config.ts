import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// import packageJson from './package.json';

// export default createViteConfig({
//   packageName: packageJson.name,
//   formats: ['es', 'cjs'],
//   external: ['@tma.js/navigation', '@solidjs/router'],
// });

export default defineConfig({
  plugins: [
    dts({ outDir: 'dist/dts' }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: { external: ['@solidjs/router', '@tma.js/sdk-solid'] },
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
  },
})
