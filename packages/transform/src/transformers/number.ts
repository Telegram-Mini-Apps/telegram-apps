import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import { createTypeError } from '@/errors/createTypeError.js';
import type { TransformerGen } from '@/types.js';

export const number: TransformerGen<number> = createTransformerGen((value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const num = Number(value);
    if (!Number.isNaN(num)) {
      return num;
    }
  }

  throw createTypeError();
}, 'number');
