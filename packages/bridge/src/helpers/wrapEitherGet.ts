import type { Either } from 'fp-ts/Either';

import { eitherGet } from '@/helpers/eitherGet.js';

/**
 * Wraps the function returning an either and creating a new function.
 * The returned function generates results based on the unwrapped either using
 * the `eitherGet` function.
 * @param fn - function to wrap.
 */
export function wrapEitherGet<Fn extends (...args: any[]) => Either<any, any>>(
  fn: Fn,
): (...args: Parameters<Fn>) => ReturnType<Fn> extends Either<any, infer U> ? U : never {
  return (...args) => eitherGet(fn(...args));
}