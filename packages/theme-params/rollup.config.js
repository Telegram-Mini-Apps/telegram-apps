import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import {defineConfig} from 'rollup';
import {createRequire} from 'node:module';
import {nodeResolve} from '@rollup/plugin-node-resolve';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default [
  // Main functionality: CJS, ESM.
  defineConfig({
    input: 'src/index.ts',
    output: [
      {file: pkg.main, format: 'commonjs'},
      {file: pkg.module, format: 'esm'},
    ],
    external: ['twa-core'],
    plugins: [
      typescript({tsconfig: './tsconfig.main.json'}),
      terser(),
    ],
  }),

  // Main functionality: Browser.
  defineConfig({
    input: 'src/index.ts',
    output: {file: pkg.browser, format: 'iife', name: 'TwaThemeParams'},
    plugins: [
      typescript({tsconfig: './tsconfig.main.json'}),
      nodeResolve(),
      terser(),
    ],
  }),
];