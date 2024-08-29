import { throwUnexpectedValue } from '@/errors/throwUnexpectedValue.js';

import { createTransformerGen } from './createTransformerGen.js';

export const fn = createTransformerGen<(...args: unknown[]) => unknown>('fn', (v) => {
  if (typeof v === 'function') {
    return v as (...args: unknown[]) => unknown;
  }
  throwUnexpectedValue(v);
});