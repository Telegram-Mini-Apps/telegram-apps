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
    external: ['@twa.js/colors'],
    plugins: [typescript({ tsconfig: './tsconfig.build.json' }), terser()],
  }),

  // Browser.
  defineConfig({
    input,
    output: {
      file: pkg.browser,
      format: 'iife',
      name: 'TwaParsing',
      sourcemap: true,
    },
    plugins: [typescript({ tsconfig: './tsconfig.build.json' }), nodeResolve(), terser()],
  }),

  defineConfig({
    input,
    output: { file: pkg.types },
    external: ['@twa.js/colors'],
    plugins: [typescript({
      tsconfig: './tsconfig.build.json',
      compilerOptions: {
        declaration: true,
        emitDeclarationOnly: true,
        sourceMap: false,
        inlineSources: false,
      },
    }), terser()],
  }),
];
