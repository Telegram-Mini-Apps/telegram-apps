import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import type { AnyFn } from '@/types/misc.js';

export type AnyEither<L = any, R = any> = E.Either<L, R> | TE.TaskEither<L, R>;
export type AnyFnAnyEither<L = any, R = any> = (...args: any) => AnyEither<L, R>;

export type RightOfEither<T extends AnyEither> = [T] extends [E.Either<any, infer U>]
  ? U
  : T extends TE.TaskEither<any, infer U>
    ? U
    : never;
export type LeftOfEither<T extends AnyEither> = [T] extends [E.Either<infer U, any>]
  ? U
  : T extends TE.TaskEither<infer U, any>
    ? U
    : never;
export type RightOfReturn<F extends AnyFnAnyEither> = RightOfEither<ReturnType<F>>;
export type LeftOfReturn<F extends AnyFnAnyEither> = LeftOfEither<ReturnType<F>>;

export type MaybeMonadToCommon<T> = [T] extends [E.Either<any, infer U>]
  ? U
  : T extends TE.TaskEither<any, infer U>
    ? Promise<U>
    : T;

export type MaybeMonadReturnTypeToCommon<Fn extends AnyFn> = MaybeMonadToCommon<ReturnType<Fn>>;

export function throwifyAnyEither<E extends AnyEither>(either: E): MaybeMonadToCommon<E> {
  const onError = (e: unknown) => {
    throw e;
  };
  return (
    typeof either === 'function'
      ? pipe(either, TE.match(onError, data => data))()
      : pipe(either, E.match(onError, data => data))
  ) as MaybeMonadToCommon<E>;
}

export function throwifyFpFn<Fn extends AnyFnAnyEither>(
  fn: Fn,
): (
  & ((...args: Parameters<Fn>) => MaybeMonadReturnTypeToCommon<Fn>)
  & { [K in keyof Fn]: Fn[K] }
) {
  return Object.assign(
    (...args: Parameters<Fn>) => {
      return throwifyAnyEither(fn(...args)) as MaybeMonadReturnTypeToCommon<Fn>;
    },
    fn,
  );
}
