import { AbortablePromise } from 'better-promises';
import {
  batch,
  type Computed,
  type Signal,
} from '@telegram-apps/signals';
import { createComputed, createSignalsTuple, type SignalsTuple } from '@/signals-registry.js';
import { ConcurrentCallError } from '@/errors.js';

export function defineNonConcurrentFn<Fn extends (...args: any) => AbortablePromise<any>>(
  fn: Fn,
  errorMessage: string,
  options?: {
    /**
     * A signal with the promise to use instead of the generated one.
     */
    promise?: Signal<AbortablePromise<Awaited<ReturnType<Fn>>> | undefined>;
    /**
     * A signal with the error to use instead of the generated one.
     */
    error?: Signal<Error | undefined>;
  },
): [
  fn: Fn,
  promise: [
    ...SignalsTuple<AbortablePromise<Awaited<ReturnType<Fn>>> | undefined>,
    isRequesting: Computed<boolean>,
  ],
  error: SignalsTuple<Error | undefined>
] {
  options ||= {};
  const {
    promise: optionsPromise,
    error: optionsError,
  } = options;
  const [_promise, promise] =
    optionsPromise
      ? [optionsPromise, createComputed(optionsPromise)]
      : createSignalsTuple<AbortablePromise<Awaited<ReturnType<Fn>>> | undefined>();
  const [_error, error] =
    optionsError
      ? [optionsError, createComputed(optionsError)]
      : createSignalsTuple<Error | undefined>();

  return [
    Object.assign((...args: Parameters<Fn>): AbortablePromise<Awaited<ReturnType<Fn>>> => {
      if (_promise()) {
        const err = new ConcurrentCallError(errorMessage);
        _error.set(err);
        return AbortablePromise.reject(err);
      }

      batch(() => {
        _promise.set(fn(...args));
        _error.set(undefined);
      });

      let error: Error | undefined;
      return _promise()!
        .catch(e => {
          error = e;
          throw e;
        })
        .finally(() => {
          batch(() => {
            _promise.set(undefined);
            _error.set(error);
          });
        });
    }, fn),
    [_promise, promise, createComputed(() => !!_promise())],
    [_error, error],
  ];
}