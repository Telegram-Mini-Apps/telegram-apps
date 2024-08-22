import { throwUnexpectedValue } from '@/errors/throwUnexpectedValue.js';
import type { TransformerGen, TransformFn } from '@/types.js';

import { createTransformerGen } from './createTransformerGen.js';

export function array<T>(of: TransformFn<T>, name?: string): TransformerGen<T[]> {
  return createTransformerGen(name || 'array', v => {
    let a: unknown[] | undefined;

    if (Array.isArray(v)) {
      a = v;
    } else if (typeof v === 'string') {
      try {
        const json = JSON.parse(v);
        if (Array.isArray(json)) {
          a = json;
        }
      } catch {
      }
    }
    if (!a) {
      throwUnexpectedValue(v);
    }
    return a.map(of);
  });
}
