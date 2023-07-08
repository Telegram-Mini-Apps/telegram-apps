/* eslint-disable import/no-extraneous-dependencies */
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';
import { createRequire } from 'node:module';
import sourcemaps from 'rollup-plugin-sourcemaps';
import del from 'rollup-plugin-delete';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default defineConfig({
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'commonjs', sourcemap: true },
    { file: pkg.browser, format: 'iife', name: 'TwaUtils', sourcemap: true },
    { file: pkg.module, format: 'esm', sourcemap: true },
  ],
  plugins: [del({ targets: ['dist/*'] }), typescript(), sourcemaps(), terser()],
});
