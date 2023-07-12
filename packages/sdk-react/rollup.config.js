import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';
import { createRequire } from 'node:module';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default [
  // CJS, ESM.
  defineConfig({
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'commonjs', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
    ],
    external: ['@twa.js/sdk', '@twa.js/bridge', 'react'],
    plugins: [typescript(), sourcemaps(), terser()],
  }),

  // UMD.
  defineConfig({
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'TwaSDKReact',
      globals: { react: 'React' },
      sourcemap: true,
    },
    external: ['react'],
    plugins: [typescript(), sourcemaps(), nodeResolve(), terser()],
  }),
];
