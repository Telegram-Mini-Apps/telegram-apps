import { getConfig } from './build/getConfig.js';

export default getConfig({
  input: 'src/index.ts',
  formats: ['es', 'cjs'],
  declarations: true,
});