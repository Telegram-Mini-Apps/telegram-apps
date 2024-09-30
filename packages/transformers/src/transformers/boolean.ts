import { throwUnexpectedValue } from '@/errors/throwUnexpectedValue.js';
import type { TransformerGen } from '@/types.js';

import { createTransformerGen } from './createTransformerGen.js';

export const boolean: TransformerGen<boolean> = createTransformerGen('boolean', v => {
  if (typeof v === 'boolean') {
    return v;
  }
  const str = String(v);
  if (str === '1' || str === 'true') {
    return true;
  }
  if (str === '0' || str === 'false') {
    return false;
  }
  throwUnexpectedValue(v);
});
