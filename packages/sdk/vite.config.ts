import { getConfig } from './build/getConfig';

export default getConfig({
  input: 'src/index.ts',
  formats: ['es', 'cjs'],
  declarations: true,
});