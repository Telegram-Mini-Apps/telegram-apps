/* eslint-disable import/no-extraneous-dependencies */
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  input: fileURLToPath(new URL('index.ts', import.meta.url)),
  output: {
    file: fileURLToPath(new URL('bundle.js', import.meta.url)),
    format: 'iife',
  },
  plugins: [
    typescript({
      tsconfig: fileURLToPath(new URL('tsconfig.json', import.meta.url)),
    }),
    nodeResolve(),
    serve({ contentBase: 'playground' }),
  ],
  watch: { clearScreen: true },
});
