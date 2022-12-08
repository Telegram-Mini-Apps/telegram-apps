import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import {defineConfig} from 'rollup';

export default defineConfig({
  input: 'playground/src/index.tsx',
  output: {file: 'playground/bundle.js', format: 'umd'},
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
    nodeResolve(),
    commonjs(),
    typescript({tsconfig: './playground/tsconfig.json'}),
    serve({contentBase: './playground', port: '3000'}),
  ],
  watch: {clearScreen: true},
});