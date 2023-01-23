import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import {defineConfig} from 'rollup';
import {fileURLToPath, URL} from 'node:url';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default defineConfig({
  input: fileURLToPath(new URL('index.tsx', import.meta.url)),
  output: {
    file: fileURLToPath(new URL('bundle.js', import.meta.url)),
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    typescript({
      tsconfig: fileURLToPath(new URL('tsconfig.json', import.meta.url))
    }),
    sourcemaps(),
    nodeResolve(),
    commonjs(),
    serve({contentBase: 'playground'}),
  ],
  watch: {clearScreen: true},
});