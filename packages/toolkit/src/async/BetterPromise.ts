import { TypedError } from '@/errors/TypedError.js';
import { addEventListener } from '@/addEventListener.js';
import { createCbCollector } from '@/createCbCollector.js';
import type { Maybe } from '@/types/misc.js';

import { createTimeoutError, createAbortError } from './errors.js';
import type { AsyncOptions } from './types.js';

export type PromiseResolveFn<T> = (value: T | PromiseLike<T>) => void;

export type PromiseRejectFn = (reason?: any) => void;

export type PromiseExecutorFn<T> = (
  res: PromiseResolveFn<T>,
  rej: PromiseRejectFn,
  abortSignal: AbortSignal,
) => any;

export type PromiseOnFulfilledFn<TResult1, TResult2> = (value: TResult1) => TResult2 | PromiseLike<TResult2>;

export type PromiseOnRejectedFn<T> = (value: any) => T | PromiseLike<T>;

/**
 * Improved version of the JavaScript Promise.
 */
export class BetterPromise<Result, Resolvable = Result> extends Promise<Result> {
  /**
   * Creates a new BetterPromise instance using executor, resolving promise when a result
   * was returned.
   * @param fn - function returning promise result.
   * @param options - additional options.
   */
  static withFn<T>(fn: () => (T | PromiseLike<T>), options?: AsyncOptions): BetterPromise<T> {
    return new BetterPromise((res, rej) => {
      try {
        const result = fn();
        return result instanceof Promise ? result.then(res, rej) : res(result);
      } catch (e) {
        rej(e);
      }
    }, options);
  }

  /**
   * @see Promise.resolve
   */
  static override resolve(): BetterPromise<void>;
  /**
   * @see Promise.resolve
   */
  static override resolve<T>(value: T): BetterPromise<T>;
  /**
   * @see Promise.resolve
   */
  static override resolve<T>(value?: T): BetterPromise<T> {
    return new BetterPromise(resolve => {
      resolve(value as T);
    });
  }

  /**
   * @see Promise.reject
   */
  static override reject<T = never>(reason?: any): BetterPromise<T> {
    return new BetterPromise((_, reject) => {
      reject(reason);
    });
  }

  /**
   * Creates a new BetterPromise instance using only options.
   * @param options - additional options.
   */
  constructor(options?: AsyncOptions);
  /**
   * Creates a new BetterPromise instance using specified executor and additional options.
   * @param executor - promise executor.
   * @param options - additional options.
   */
  constructor(executor?: PromiseExecutorFn<Result>, options?: AsyncOptions);
  constructor(
    executorOrOptions?: PromiseExecutorFn<Result> | AsyncOptions,
    maybeOptions?: AsyncOptions,
  ) {
    let executor: PromiseExecutorFn<Result> | undefined;
    let options: AsyncOptions | undefined;

    if (typeof executorOrOptions === 'function') {
      executor = executorOrOptions;
      options = maybeOptions;
    } else {
      options = executorOrOptions;
    }

    let resolve!: PromiseResolveFn<Result>;
    let reject!: PromiseRejectFn;
    super((res, rej) => {
      // If an abort signal was passed initially in the promise, and it was in aborted state, it
      // means that we have to prevent the executor from being called, just because there is no
      // reason to do it.
      //
      // This signal will not be passed in case the promise was constructed via the "then" or
      // "finally" methods, so we wouldn't have any related problems due to unhandled promise
      // rejections.
      options ||= {};
      const { abortSignal } = options;
      if (abortSignal && abortSignal.aborted) {
        return rej(createAbortError(abortSignal.reason));
      }

      /* CLEANUP */
      const [addCleanup, cleanup] = createCbCollector();
      const withCleanup = <F extends (...args: any) => any>(fn: F): F => {
        return ((...args) => {
          cleanup();
          return fn(...args);
        }) as F;
      };

      // We are going to use our controller signal in the executor because we can control it.
      // We can't say the same about the abort signal passed from above, we can't abort it by
      // ourselves.
      const controller = new AbortController();
      const { signal: controllerSignal } = controller;

      // The reject method should just abort the controller signal. In turn, it will reject
      // the promise and notify the executor about the rejection.
      reject = withCleanup(reason => {
        controller.abort(reason);
        rej(reason);
      });
      resolve = withCleanup(res);

      /* ABORT SIGNAL */
      abortSignal && addCleanup(
        addEventListener(abortSignal, 'abort', () => {
          reject(createAbortError(abortSignal.reason));
        }),
      );

      /* TIMEOUT */
      const { timeout } = options;
      if (timeout) {
        const timeoutId = setTimeout(() => {
          reject(createTimeoutError(timeout));
        }, timeout);

        addCleanup(() => {
          clearTimeout(timeoutId);
        });
      }

      executor && executor(resolve, reject, controllerSignal);
    });

    this.resolve = resolve as unknown as PromiseResolveFn<Resolvable>;
    this.reject = reject;
  }

  /**
   * Cancels the promise execution.
   */
  cancel(): void {
    this.reject(new TypedError('ERR_CANCELLED'));
  }

  /**
   * @see Promise.catch
   */
  override catch<CatchResult = never>(
    onRejected?: Maybe<PromiseOnRejectedFn<CatchResult>>,
  ): BetterPromise<Result | CatchResult, Resolvable> {
    return this.then(undefined, onRejected);
  }

  /**
   * @see Promise.finally
   */
  override finally(onFinally?: Maybe<() => void>): BetterPromise<Result, Resolvable> {
    return this.wired(super.finally(onFinally) as BetterPromise<Result>);
  }

  /**
   * Resolves the promise.
   */
  resolve!: PromiseResolveFn<Resolvable>;

  /**
   * Rejects the promise.
   */
  reject!: PromiseRejectFn;

  /**
   * @see Promise.then
   */
  then<A = Result, B = never>(
    onFulfilled?: Maybe<PromiseOnFulfilledFn<Result, A>>,
    onRejected?: Maybe<PromiseOnRejectedFn<B>>,
  ): BetterPromise<A | B, Resolvable> {
    return this.wired(super.then(onFulfilled, onRejected) as BetterPromise<A | B>);
  }

  private wired<T>(promise: BetterPromise<T, any>): BetterPromise<T, Resolvable> {
    promise.reject = this.reject;
    promise.resolve = this.resolve;
    return promise;
  }
}
