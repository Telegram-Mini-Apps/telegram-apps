import { either, function as fn } from 'fp-ts';

/**
 * Returns either's right if it is present. Throws left otherwise.
 * @param e - either instance.
 */
export function eitherGet<L, R>(e: either.Either<L, R>): R {
  return fn.pipe(
    e,
    either.match(
      e => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw e;
      },
      v => v,
    ),
  );
}