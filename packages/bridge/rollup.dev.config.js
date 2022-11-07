import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {defineConfig} from 'rollup';
import serve from 'rollup-plugin-serve';

export default defineConfig({
  input: 'playground/index.ts',
  output: {file: 'playground/bundle.js', format: 'iife'},
  plugins: [
    typescript({tsconfig: './playground/tsconfig.json'}),
    nodeResolve(),
    serve('playground'),
  ],
  watch: {clearScreen: true},
});