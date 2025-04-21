import { getConfig } from './build/getConfig.js';

export default getConfig({
  input: 'src/index.ts',
  formats: ['iife'],
  inlineModules: true,
});