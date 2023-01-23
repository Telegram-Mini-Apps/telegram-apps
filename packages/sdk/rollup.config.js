import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import {defineConfig} from 'rollup';
import {createRequire} from 'node:module';
import {nodeResolve} from '@rollup/plugin-node-resolve';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default [
  // CJS, ESM.
  defineConfig({
    input: 'src/index.ts',
    output: [
      {file: pkg.main, format: 'commonjs'},
      {file: pkg.module, format: 'esm'},
    ],
    external: ['@twa.js/utils', '@twa.js/init-data', '@twa.js/bridge'],
    plugins: [typescript(), terser()],
  }),

  // Browser.
  defineConfig({
    input: 'src/index.ts',
    output: {file: pkg.browser, format: 'iife', name: 'TwaSDK'},
    plugins: [typescript(), nodeResolve(), terser()],
  }),
];