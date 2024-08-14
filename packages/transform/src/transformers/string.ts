import { createTypeError } from '@/errors/createTypeError.js';
import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import type { TransformerGen } from '@/types.js';

export const string: TransformerGen<string> = createTransformerGen((value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString();
  }
  throw createTypeError();
}, 'string');
