import * as E from 'fp-ts/Either';

export type RightOf<E extends E.Either<any, any>> = E extends E.Right<infer U>
  ? U
  : never;

export type RightOfFnReturnType<F extends (...args: any) => E.Either<any, any>> =
  RightOf<ReturnType<F>>;

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
): (...args: Parameters<Fn>) => RightOfFnReturnType<Fn> {
  return (...args) => eitherGet(fn(...args));
}
