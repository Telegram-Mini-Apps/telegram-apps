import { TypedError } from '@/errors/TypedError.js';
import { addEventListener } from '@/addEventListener.js';
import type { Maybe } from '@/types/misc.js';

import { createTimeoutError, createAbortError } from './errors.js';
import type { AsyncOptions } from './types.js';

export type PromiseResolveFn<T> = (value: T | PromiseLike<T>) => void;
export type PromiseRejectFn = (reason?: any) => void;
export type PromiseExecutor<T> = (res: PromiseResolveFn<T>, rej: PromiseRejectFn) => any;
export type PromiseOnFulfilledFn<TResult1, TResult2> = (value: TResult1) => TResult2 | PromiseLike<TResult2>;
export type PromiseOnRejectedFn<T> = (value: any) => T | PromiseLike<T>;

/**
 * Improved version of the JavaScript Promise.
 */
export class BetterPromise<T> extends Promise<T> {
  /**
   * Creates a new BetterPromise instance using specified executor and additional options.
   * @param executor - promise executor.
   * @param options - additional options.
   */
  static withOptions<T>(executor?: PromiseExecutor<T>, options?: AsyncOptions): BetterPromise<T>;
  /**
   * Creates a new BetterPromise instance using only options.
   * @param options - additional options.
   */
  static withOptions<T>(options?: AsyncOptions): BetterPromise<T>;
  static withOptions<T>(
    executorOrOptions?: PromiseExecutor<T> | AsyncOptions,
    options?: AsyncOptions,
  ): BetterPromise<T> {
    let executor: PromiseExecutor<T> | undefined;
    let asyncOptions: AsyncOptions;

    executorOrOptions ||= {};
    if (typeof executorOrOptions === 'function') {
      executor = executorOrOptions;
      asyncOptions = options || {};
    } else {
      asyncOptions = executorOrOptions;
    }

    const { abortSignal } = asyncOptions;
    let promise = new BetterPromise<T>((res, rej) => {
      if (abortSignal && abortSignal.aborted) {
        rej(createAbortError(abortSignal.reason));
      }
      executor && executor(res, rej);
    });

    const { timeout } = asyncOptions;
    if (timeout) {
      // NOTE: You may wonder why we just don't create timeout via setTimeout and reject
      //  the promise via promise.reject. The reason is this approach works improperly
      //  in some environment. For example, in Vitest.
      let timeoutId: number | undefined;
      promise = new BetterPromise<T>((res, rej) => {
        Promise
          .race([
            promise,
            new Promise<never>((_, rej) => {
              timeoutId = (setTimeout as typeof window.setTimeout)(() => {
                rej(createTimeoutError(timeout));
              }, timeout);
            }),
          ])
          .then(res, rej)
          .finally(() => {
            clearTimeout(timeoutId);
          });
      });
    }

    if (abortSignal) {
      // NOTE: See timeout note.
      let removeAbortListener: (() => void) | undefined;
      promise = new BetterPromise((res, rej) => {
        Promise
          .race([
            promise,
            new Promise<never>((_, rej) => {
              removeAbortListener = addEventListener(abortSignal, 'abort', () => {
                rej(createAbortError(abortSignal.reason));
              });
            }),
          ])
          .then(res, rej)
          .finally(removeAbortListener);
      });
    }

    return promise;
  }

  /**
   * Creates a new BetterPromise instance using executor, resolving promise when a result
   * was returned.
   * @param fn - function returning promise result.
   * @param options - additional options.
   */
  static withFn<T>(fn: () => (T | PromiseLike<T>), options?: AsyncOptions): BetterPromise<T> {
    return this.withOptions((res, rej) => {
      try {
        const result = fn();
        if (result instanceof Promise) {
          result.then(res, rej);
        } else {
          res(result);
        }
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
  static override resolve<T>(value?: T): BetterPromise<T>;
  /**
   * @see Promise.resolve
   */
  static override resolve<T>(value?: T): BetterPromise<T> {
    return this.withFn<T>(() => value as T);
  }

  /**
   * @see Promise.reject
   */
  static override reject<T = never>(reason?: any): BetterPromise<T> {
    return this.withFn<T>(() => {
      throw reason;
    });
  }

  constructor(executor?: PromiseExecutor<T>) {
    let resolve!: PromiseResolveFn<T>;
    let reject!: PromiseRejectFn;
    super((res, rej) => {
      resolve = res;
      reject = rej;
      executor && executor(res, rej);
    });
    this.resolve = resolve;
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
  override catch<TResult = never>(
    onRejected?: Maybe<PromiseOnRejectedFn<TResult>>,
  ): BetterPromise<T | TResult> {
    return super.catch(onRejected) as BetterPromise<T | TResult>;
  }

  /**
   * @see Promise.finally
   */
  override finally(onFinally?: (() => void) | undefined | null): BetterPromise<T> {
    return super.finally(onFinally) as BetterPromise<T>;
  }

  /**
   * Resolves the promise.
   */
  resolve!: PromiseResolveFn<T>;

  /**
   * Rejects the promise.
   */
  reject!: PromiseRejectFn;

  /**
   * @see Promise.then
   */
  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: Maybe<PromiseOnFulfilledFn<T, TResult1>>,
    onRejected?: Maybe<PromiseOnRejectedFn<TResult2>>,
  ): BetterPromise<TResult1 | TResult2> {
    return super.then(onFulfilled, onRejected) as BetterPromise<TResult1 | TResult2>;
  }
}
