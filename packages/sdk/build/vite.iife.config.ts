import { getConfig } from './utils.js';

export default getConfig({
  input: 'src/index.ts',
  filename: 'index',
  formats: ['iife'],
  declarations: false,
});