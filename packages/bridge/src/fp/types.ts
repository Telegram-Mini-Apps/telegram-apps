import type { Either, Left, Right } from 'fp-ts/Either';

export type LeftOf<E extends Either<any, any>> = E extends Left<infer U>
  ? U
  : never;

export type RightOf<E extends Either<any, any>> = E extends Right<infer U>
  ? U
  : never;

export type LeftOfFnReturnType<F extends (...args: any) => Either<any, any>> =
  LeftOf<ReturnType<F>>;

export type RightOfFnReturnType<F extends (...args: any) => Either<any, any>> =
  RightOf<ReturnType<F>>;
