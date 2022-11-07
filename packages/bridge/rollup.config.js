import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import {defineConfig} from 'rollup';
import del from 'rollup-plugin-delete';
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
    external: ['twa-core'],
    plugins: [del({targets: 'dist'}), typescript(), terser()],
  }),

  // Browser.
  defineConfig({
    input: 'src/index.ts',
    output: {file: pkg.browser, format: 'iife', name: 'TwaBridge'},
    plugins: [typescript(), nodeResolve(), terser()],
  }),
];