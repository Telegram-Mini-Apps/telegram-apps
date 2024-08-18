import { createError } from '@/errors/createError.js';
import { ERR_PARSE } from '@/errors/errors.js';
import type { TransformerGen, TransformFn } from '@/types.js';

/**
 * Creates transformer generator using the passed transform function as a base.
 * @param transform - transform function.
 * @param name - custom transformer name.
 */
export function createTransformerGen<T>(transform: TransformFn<T>, name?: string): TransformerGen<T> {
  return ((optional?) => {
    return (value: unknown) => {
      if (optional && value === undefined) {
        return;
      }

      try {
        return transform(value);
      } catch (cause) {
        throw createError(
          ERR_PARSE,
          `Unable to parse value${name ? ` as ${name}` : ''}`,
          cause,
        );
      }
    };
  }) as TransformerGen<T>;
}
