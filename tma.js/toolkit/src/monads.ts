import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

export type AnyEither<L = any, R = any> = E.Either<L, R> | TE.TaskEither<L, R>;
export type AnyFnAnyEither<L = any, R = any> = (...args: any) => AnyEither<L, R>;

export type RightOfEither<E extends AnyEither> = E extends AnyEither<any, infer U> ? U : never;
export type LeftOfEither<E extends AnyEither> = E extends AnyEither<infer U> ? U : never;
export type RightOfReturn<F extends AnyFnAnyEither> = RightOfEither<ReturnType<F>>;
export type LeftOfReturn<F extends AnyFnAnyEither> = LeftOfEither<ReturnType<F>>;

/**
 * @param either - Either monad.
 * @returns Either's right if its tag is right. Throws left otherwise.
 */
export function eitherGet<T>(either: E.Either<any, T>): T {
  if (either._tag === 'Left') {
    throw either.left;
  }
  return either.right;
}

export function eitherFnToSimple<Fn extends (...args: any) => E.Either<any, any>>(
  fn: Fn,
): (...args: Parameters<Fn>) => RightOfReturn<Fn> {
  return (...args) => eitherGet(fn(...args));
}
