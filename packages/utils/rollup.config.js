import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import {defineConfig} from 'rollup';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {file: pkg.main, format: 'commonjs'},
    {file: pkg.browser, format: 'iife', name: 'TwaUtils'},
    {file: pkg.module, format: 'esm'},
  ],
  plugins: [typescript(), terser()],
});