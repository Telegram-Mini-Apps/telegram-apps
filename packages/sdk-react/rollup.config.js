import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';
import { createRequire } from 'node:module';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const input = 'src/index.ts';

export default [
  defineConfig({
    input,
    output: [
      { file: pkg.main, format: 'commonjs', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
    ],
    external: ['@twa.js/sdk', '@twa.js/bridge', 'react'],
    plugins: [typescript(), terser()],
  }),

  defineConfig({
    input,
    output: {
      file: pkg.browser,
      format: 'iife',
      name: 'TwaSDKReact',
      globals: { react: 'React' },
      sourcemap: true,
    },
    external: ['react'],
    plugins: [typescript(), nodeResolve(), terser()],
  }),

  defineConfig({
    input,
    output: { file: pkg.types },
    external: ['@twa.js/sdk', '@twa.js/bridge', 'react'],
    plugins: [typescript({
      compilerOptions: {
        declaration: true,
        emitDeclarationOnly: true,
        sourceMap: false,
        inlineSources: false,
      },
    }), terser()],
  }),
];
