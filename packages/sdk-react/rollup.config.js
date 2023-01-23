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
    external: ['@twa.js/sdk', '@twa.js/bridge', 'react'],
    plugins: [typescript(), terser()],
  }),

  // UMD.
  defineConfig({
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'TwaSDKReact',
      globals: {'react': 'React'},
    },
    external: ['react'],
    plugins: [typescript(), nodeResolve(), terser()],
  }),
];