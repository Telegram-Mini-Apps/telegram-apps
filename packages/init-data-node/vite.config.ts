// import { createViteConfig, createVitestConfig } from 'build-utils';

// import packageJson from './package.json';
import { defineConfig } from 'vite';
// import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
// import { formatTmaJSPackageName } from 'build-utils/src';

// export default createViteConfig({
//   packageName: packageJson.name,
//   formats: ['es', 'cjs'],
//   external: ['node:crypto', 'node:url'],
//   test: createVitestConfig({
//     coverage: {
//       branches: 100,
//       functions: 100,
//       statements: 100,
//       lines: 100,
//     },
//   }),
// });

export default defineConfig(() => {
  return {
    test: {
      include: ['src/**/*.test.ts'],
      coverage: {
        enabled: true,
        provider: 'v8',
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts'],
        branches: 100,
        functions: 100,
        statements: 100,
        lines: 100,
      },
    },
    plugins: [
      dts({ outDir: 'dist/dts', tsconfigPath: './tsconfig.json' }),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: { external: ['node:crypto', 'node:url'] },
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName(format) {
          switch (format) {
            case 'cjs':
              return 'index.cjs';
            case 'es':
              return 'index.mjs';
            default:
              return 'index';
          }
        },
      },
    },
  };
});
