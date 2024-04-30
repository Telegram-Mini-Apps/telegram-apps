import { getConfig } from './build/getConfig';

export default getConfig({
  input: 'src/index.ts',
  filename: 'index',
  formats: ['iife'],
  declarations: false,
});