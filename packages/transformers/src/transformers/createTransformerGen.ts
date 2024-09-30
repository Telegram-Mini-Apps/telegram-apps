import {TypedError} from '@telegram-apps/toolkit';

import { ERR_PARSE } from '@/errors/errors.js';
import type { Transformer, TransformerGen, TransformFn } from '@/types.js';

/**
 * Creates transformer generator using the passed transform function as a base.
 * @param transform - transform function.
 * @param name - custom transformer name.
 */
export function createTransformerGen<T>(
  name: string,
  transform: TransformFn<T>
): TransformerGen<T> {
  return (optional?) => {
    const parse = ((value: unknown) => {
      if (optional && value === undefined) {
        return;
      }

      try {
        return transform(value);
      } catch (cause) {
        throw new TypedError(ERR_PARSE, {
          message: `"${name}" transformer failed to parse the value`,
          cause,
        });
      }
    }) as TransformFn<T>;

    return /* #__PURE__ */ Object.assign(
      parse,
      {
        isValid(value: unknown): value is T {
          try {
            parse(value);
            return true;
          } catch {
            return false;
          }
        }
      }
    ) satisfies Transformer<T>
  };
}
