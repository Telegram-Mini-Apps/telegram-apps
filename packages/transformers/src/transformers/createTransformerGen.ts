import { ERR_PARSE } from '@/errors/errors.js';
import { TransformerError } from '@/errors/TransformerError.js';
import type { TransformerGen, TransformFn } from '@/types.js';

/**
 * Creates transformer generator using the passed transform function as a base.
 * @param transform - transform function.
 * @param name - custom transformer name.
 */
export function createTransformerGen<T>(name: string, transform: TransformFn<T>): TransformerGen<T> {
  return ((optional?) => {
    return (value: unknown) => {
      if (optional && value === undefined) {
        return;
      }

      try {
        return transform(value);
      } catch (cause) {
        throw new TransformerError(ERR_PARSE, {
          message: `"${name}" transformer failed to parse the value`,
          cause,
        });
      }
    };
  }) as TransformerGen<T>;
}
