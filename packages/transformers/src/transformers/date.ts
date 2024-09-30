import type { TransformerGen } from '@/types.js';

import { createTransformerGen } from './createTransformerGen.js';
import { number } from './number.js';

export const date: TransformerGen<Date> = createTransformerGen('date', v => (
  v instanceof Date ? v : new Date(number()(v) * 1000)
));
