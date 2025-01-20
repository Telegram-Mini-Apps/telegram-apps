import { CancelablePromise } from 'better-promises';
import { batch, type Computed } from '@telegram-apps/signals';

import { ConcurrentCallError } from '@/errors.js';
import { createComputed, createSignalsTuple } from '@/signals-registry.js';

/**
 * Wraps the specified function preventing it from calling concurrently.
 * @returns A tuple, containing four values:
 * 1. A function accepting the same arguments as the wrapped function and returning a cancelable
 * promise with the wrapped function execution result.
 * 2. A signal with promise containing the wrapped function execution result.
 * 3. A signal with promise containing true if the wrapped function execution is currently in progress.
 * 4. A signal with promise containing the last call wrapped function execution error.
 * @param fn - a wrapped function.
 * @param errorMessage - a message to place in the ConcurrentCallError constructor if concurrent
 * call was performed.
 */
export function defineNonConcurrentFn<Fn extends (...args: any) => any>(
  fn: Fn,
  errorMessage: string,
): [
  fn: (...args: Parameters<Fn>) => CancelablePromise<Awaited<ReturnType<Fn>>>,
  promise: Computed<CancelablePromise<ReturnType<Fn>> | undefined>,
  isRequesting: Computed<boolean>,
  error: Computed<Error | undefined>,
] {
  const [_promise, promise] = createSignalsTuple<CancelablePromise<Awaited<ReturnType<Fn>>> | undefined>();
  const [_error, error] = createSignalsTuple<Error | undefined>();

  return [
    (...args: Parameters<Fn>): CancelablePromise<Awaited<ReturnType<Fn>>> => {
      return CancelablePromise
        .resolve()
        .then(async () => {
          // Check if the operation is currently not in progress.
          if (promise()) {
            const err = new ConcurrentCallError(errorMessage);
            _error.set(err);
            throw err;
          }

          // Start performing the wrapped function.
          batch(() => {
            _promise.set(CancelablePromise.resolve(fn(...args)));
            _error.set(undefined);
          });

          let result: [ok: true, result: Awaited<ReturnType<Fn>>] | [ok: false, err: Error];
          try {
            result = [true, await promise()!];
          } catch (e) {
            result = [false, e as Error];
          }

          // Actualize the state.
          batch(() => {
            _promise.set(undefined);
            _error.set(result[0] ? undefined : result[1]);
          });

          // Throw the error or return the result.
          if (!result[0]) {
            throw result[1];
          }
          return result[1];
        }) as CancelablePromise<Awaited<ReturnType<Fn>>>;
    },
    promise,
    createComputed(() => !!promise()),
    error,
  ];
}