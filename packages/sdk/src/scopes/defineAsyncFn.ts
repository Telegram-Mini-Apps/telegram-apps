import { CancelablePromise } from 'better-promises';
import { batch, type Computed, Signal } from '@telegram-apps/signals';

import { createComputed, createSignalsTuple } from '@/signals-registry.js';

export type DefineAsyncFnResult<Fn extends (...args: any) => any> = [
  fn: (...args: Parameters<Fn>) => CancelablePromise<Awaited<ReturnType<Fn>>>,
  promiseTuple: [
    _promise: Signal<CancelablePromise<Awaited<ReturnType<Fn>>> | undefined>,
    promise: Computed<CancelablePromise<Awaited<ReturnType<Fn>>> | undefined>,
    isRequesting: Computed<boolean>,
  ],
  errorTuple: [
    _error: Signal<Error | undefined>,
    error: Computed<Error | undefined>,
  ],
];

/**
 * Wraps the specified function preventing it from calling concurrently.
 * @returns A tuple, containing four values:
 * 1. A function accepting the same arguments as the wrapped function and returning a cancelable
 * promise with the wrapped function execution result.
 * 2. A signal with promise containing the wrapped function execution result.
 * 3. A signal with promise containing true if the wrapped function execution is currently in progress.
 * 4. A signal with promise containing the last call wrapped function execution error.
 * @param fn - a wrapped function.
 */
export function defineAsyncFn<Fn extends (...args: any) => any>(fn: Fn): DefineAsyncFnResult<Fn> {
  const [_promise, promise] = createSignalsTuple<CancelablePromise<Awaited<ReturnType<Fn>>> | undefined>();
  const [_error, error] = createSignalsTuple<Error | undefined>();

  return [
    (...args: Parameters<Fn>): CancelablePromise<Awaited<ReturnType<Fn>>> => {
      return CancelablePromise
        .resolve()
        .then(async () => {
          batch(() => {
            _promise.set(CancelablePromise.withFn(() => fn(...args)));
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
    [_promise, promise, createComputed(() => !!promise())],
    [_error, error],
  ];
}