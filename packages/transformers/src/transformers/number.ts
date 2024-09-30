import { throwUnexpectedValue } from '@/errors/throwUnexpectedValue.js';
import type { TransformerGen } from '@/types.js';

import { createTransformerGen } from './createTransformerGen.js';

export const number: TransformerGen<number> = createTransformerGen('number', v => {
  if (typeof v === 'number') {
    return v;
  }
  if (typeof v === 'string') {
    const num = Number(v);
    if (!Number.isNaN(num)) {
      return num;
    }
  }
  throwUnexpectedValue(v);
});
