import type { Either } from 'fp-ts/Either';

import { eitherGet } from '@/fp/eitherGet.js';
import type { RightOfFnReturnType } from '@/fp/types.js';

/**
 * Wraps the function returning an either and creating a new function.
 * The returned function generates results based on the unwrapped either using
 * the `eitherGet` function.
 * @param fn - function to wrap.
 */
export function wrapEitherGet<Fn extends (...args: any[]) => Either<any, any>>(
  fn: Fn,
): (...args: Parameters<Fn>) => RightOfFnReturnType<Fn> {
  return (...args) => eitherGet(fn(...args));
}
