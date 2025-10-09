import {
  type BetterPromiseOptions,
  type BetterPromiseExecutorFn,
  BetterPromise,
  type CancelledError,
  type TimeoutError,
} from 'better-promises';
import * as TE from 'fp-ts/TaskEither';

export type BetterTaskError = CancelledError | TimeoutError;

/**
 * @returns A TaskEither instance working based on the BetterPromise.
 * @param executor - promise executor.
 * @param options - promise options.
 */
export function betterTaskEither<T, E = never>(
  executor: BetterPromiseExecutorFn<T>,
  options: BetterPromiseOptions,
): TE.TaskEither<BetterTaskError | E, T> {
  return TE.tryCatch(
    () => new BetterPromise<T>(executor, options),
    e => e as CancelledError | TimeoutError | E,
  );
}
