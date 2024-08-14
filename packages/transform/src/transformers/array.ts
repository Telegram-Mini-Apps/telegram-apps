import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import { createTypeError } from '@/errors/createTypeError.js';
import type { TransformerGen, TransformFn } from '@/types.js';

export function array<T>(of: TransformFn<T>, name?: string): TransformerGen<T[]> {
  return createTransformerGen((value) => {
    let a: unknown[] | undefined;

    if (Array.isArray(value)) {
      a = value;
    } else if (typeof value === 'string') {
      try {
        const json = JSON.parse(value);
        if (Array.isArray(json)) {
          a = json;
        }
      } catch {
      }
    }

    if (!a) {
      throw createTypeError();
    }

    return a.map(of);
  }, name);
}
