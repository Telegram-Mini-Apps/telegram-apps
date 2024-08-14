import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import { createTypeError } from '@/errors/createTypeError.js';
import type { TransformerGen } from '@/types.js';

export const boolean: TransformerGen<boolean> = createTransformerGen((value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  const asString = String(value);

  if (asString === '1' || asString === 'true') {
    return true;
  }

  if (asString === '0' || asString === 'false') {
    return false;
  }

  throw createTypeError();
}, 'boolean');
