import { batch, type Signal } from '@telegram-apps/signals';
import { CancelablePromise, type TypedError } from '@telegram-apps/bridge';

type AllowedFn<Args extends any[], R> = (...args: Args) => R | CancelablePromise<R>;

/**
 * Function doing the following:
 * 1. Prevents the wrapped function from being called concurrently.
 * 2. Being called, updates the passed promise and error signals.
 * @param fn - function to wrap.
 * @param createPendingError - function that creates error in case of concurrent call
 * @param promise - signal containing the execution promise
 * @param error - signal containing the last call error.
 */
// #__NO_SIDE_EFFECTS__
export function signalifyAsyncFn<Fn extends AllowedFn<Args, Result>, Args extends any[], Result>(
  fn: Fn,
  createPendingError: () => TypedError<any>,
  promise: Signal<CancelablePromise<Result> | undefined>,
  error: Signal<Error | undefined>,
): Fn {
  return Object.assign((...args: Args): CancelablePromise<Result> => {
    return CancelablePromise
      .resolve()
      .then(async () => {
        // Check if the operation is currently not in progress.
        if (promise()) {
          const err = createPendingError();
          error.set(err);
          throw err;
        }

        // Start performing the wrapped function.
        batch(() => {
          promise.set(CancelablePromise.resolve(fn(...args)));
          error.set(undefined);
        });
        let result: [completed: true, result: Result] | [completed: false, err: Error];
        try {
          result = [true, await promise()!];
        } catch (e) {
          result = [false, e as Error];
        }

        // Actualize the state.
        batch(() => {
          promise.set(undefined);
          error.set(result[0] ? undefined : result[1]);
        });

        // Throw an error or return result.
        if (!result[0]) {
          throw result[1];
        }
        return result[1];
      });
  }, fn);
}
