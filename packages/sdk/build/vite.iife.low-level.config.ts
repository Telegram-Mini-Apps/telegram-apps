import { getConfig } from './utils.js';

export default getConfig({
  input: 'src/index.low-level.ts',
  filename: 'index.low-level',
  formats: ['iife'],
  declarations: false,
});