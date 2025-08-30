import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function.js';

/**
 * Returns either's right if it is present. Throws left otherwise.
 * @param e - either instance.
 */
export function eitherGet<L, R>(e: E.Either<L, R>): R {
  return pipe(
    e,
    E.match(
      e => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw e;
      },
      v => v,
    ),
  );
}
