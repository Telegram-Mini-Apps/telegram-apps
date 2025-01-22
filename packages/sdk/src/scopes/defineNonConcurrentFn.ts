import { CancelablePromise } from 'better-promises';

import { ConcurrentCallError } from '@/errors.js';
import {
  defineAsyncFn,
  type DefineAsyncFnResult,
  type DefineAsyncOptions,
} from '@/scopes/defineAsyncFn.js';

/**
 * Uses the defineAsyncFn function and returning its result, but adds an additional check to
 * prevent the function from being called concurrently.
 * @param fn - a wrapped function.
 * @param errorMessage - a message to place in the ConcurrentCallError constructor if concurrent
 * call was performed.
 * @param options - additional options.
 */
export function defineNonConcurrentFn<Fn extends (...args: any) => any>(
  fn: Fn,
  errorMessage: string,
  options?: DefineAsyncOptions<Awaited<ReturnType<Fn>>>,
): DefineAsyncFnResult<Fn> {
  const [
    asyncFn,
    [_promise, ...restPromise],
    [_error, error],
  ] = defineAsyncFn(fn, options);

  return [
    (...args) => CancelablePromise.withFn(() => {
      if (_promise()) {
        const err = new ConcurrentCallError(errorMessage);
        _error.set(err);
        throw err;
      }
      return asyncFn(...args);
    }),
    [_promise, ...restPromise],
    [_error, error],
  ];
}