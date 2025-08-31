import * as E from 'fp-ts/Either';

export type LeftOf<E extends E.Either<any, any>> = E extends E.Left<infer U>
  ? U
  : never;

export type RightOf<E extends E.Either<any, any>> = E extends E.Right<infer U>
  ? U
  : never;

export type LeftOfFnReturnType<F extends (...args: any) => E.Either<any, any>> =
  LeftOf<ReturnType<F>>;

export type RightOfFnReturnType<F extends (...args: any) => E.Either<any, any>> =
  RightOf<ReturnType<F>>;

export type EitherWrapped<L, R> = E.Either<L, R> & {
  /**
   * A method to retrieve the either value. Note that this function is only a helper
   * for developers not familiar with functional programming to simply get the value
   * and not use additional functions to do it.
   *
   * Essentially, this method throws left if right is not presented. Returns
   * right otherwise.
   *
   * It is recommended use additional libraries to work with monads like `fp-ts`.
   * @see fp-ts: https://www.npmjs.com/package/fp-ts
   */
  get: () => R;
};

function eitherGet<T>(either: E.Either<any, T>): T {
  if (either._tag === 'Left') {
    throw either.left;
  }
  return either.right;
}

export function eitherFnToSimple<Fn extends (...args: any) => E.Either<any, any>>(
  fn: Fn,
): Fn {
  return ((...args) => eitherGet(fn(...args))) as Fn;
}

export function wrapEitherFn<Args extends any[], L, R>(
  fn: (...args: Args) => E.Either<L, R>,
): (...args: Args) => EitherWrapped<L, R> {
  return (...args) => {
    const either = fn(...args);

    return Object.assign({}, either, {
      get: () => eitherGet(either),
    });
  };
}
