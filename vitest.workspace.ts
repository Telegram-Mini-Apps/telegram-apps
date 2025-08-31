import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*/vite.config.ts',
  'tma.js/*/vite.config.ts',
]);
