import { batch, type Signal } from '@telegram-apps/signals';
import { CancelablePromise } from 'better-promises';

/**
 * Function doing the following:
 * 1. Prevents the wrapped function from being called concurrently. If called concurrently,
 * updates the error signal.
 * 2. Being called, updates the passed promise and error signals.
 *
 * As a result, the function returns a new one, returning a cancelable promise.
 * @param fn - function to wrap.
 * @param createPendingError - function that creates error in case of concurrent call
 * @param $promise - signal containing the execution promise
 * @param $error - signal containing the last call error.
 */
// #__NO_SIDE_EFFECTS__
export function signalifyFn<T, Fn extends (...args: any) => T | PromiseLike<T>>(
  fn: Fn,
  createPendingError: () => Error,
  $promise: Signal<CancelablePromise<T> | undefined>,
  $error: Signal<Error | undefined>,
): (...args: Parameters<Fn>) => CancelablePromise<T> {
  return Object.assign((...args: Parameters<Fn>): CancelablePromise<T> => {
    return CancelablePromise
      .resolve()
      .then(async () => {
        // Check if the operation is currently not in progress.
        if ($promise()) {
          const err = createPendingError();
          $error.set(err);
          throw err;
        }

        // Start performing the wrapped function.
        batch(() => {
          $promise.set(CancelablePromise.resolve(fn(...args)));
          $error.set(undefined);
        });

        let result: [ok: true, result: T] | [ok: false, err: Error];
        try {
          result = [true, await $promise()!];
        } catch (e) {
          result = [false, e as Error];
        }

        // Actualize the state.
        batch(() => {
          $promise.set(undefined);
          $error.set(result[0] ? undefined : result[1]);
        });

        // Throw the error or return the result.
        if (!result[0]) {
          throw result[1];
        }
        return result[1];
      });
  }, fn);
}
