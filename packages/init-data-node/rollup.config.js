import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';
import { createRequire } from 'node:module';

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
    external: ['@twa.js/init-data', 'crypto'],
    plugins: [typescript(), terser()],
  }),

  defineConfig({
    input,
    output: { file: pkg.types },
    external: ['@twa.js/init-data', 'crypto'],
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
