import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { BetterPromise } from 'better-promises';

export function taskEitherToPromise<T>(
  te: TE.TaskEither<any, T>,
): BetterPromise<Awaited<T>> {
  return BetterPromise.fn(() => {
    return pipe(
      te,
      TE.match(
        error => {
          throw error;
        },
        result => result,
      ),
    )();
  });
}
