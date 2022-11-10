import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {defineConfig} from 'rollup';

export default defineConfig({
  input: 'playground/index.ts',
  output: {file: 'playground/bundle.js', format: 'iife'},
  plugins: [
    typescript({tsconfig: './playground/tsconfig.json'}),
    nodeResolve(),
    serve({contentBase: 'playground'}),
  ],
  watch: {clearScreen: true}
});