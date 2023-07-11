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
    external: ['@twa.js/utils', '@twa.js/init-data', '@twa.js/bridge'],
    plugins: [typescript(), sourcemaps(), terser()],
  }),

  // Browser.
  defineConfig({
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'iife',
      name: 'TwaSDK',
      sourcemap: true,
    },
    plugins: [typescript(), sourcemaps(), nodeResolve(), terser()],
  }),
];
