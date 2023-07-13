import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default [
  // Main functionality: CJS, ESM.
  defineConfig({
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'commonjs', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
    ],
    external: ['@twa.js/utils'],
    plugins: [
      typescript({ tsconfig: './tsconfig.main.json' }),
      terser(),
    ],
  }),

  // Main functionality: Browser.
  defineConfig({
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'iife',
      name: 'TwaInitData',
      sourcemap: true,
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.main.json' }),
      nodeResolve(),
      terser(),
    ],
  }),

  // Validation: CJS, ESM.
  defineConfig({
    input: 'src/validation.ts',
    output: [
      {
        file: pkg.exports['./validation'].require,
        format: 'commonjs',
        sourcemap: true,
      },
      {
        file: pkg.exports['./validation'].import,
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: ['@twa.js/utils', 'node:crypto'],
    plugins: [
      typescript({ tsconfig: './tsconfig.validation.json' }),
      terser(),
    ],
  }),
];
