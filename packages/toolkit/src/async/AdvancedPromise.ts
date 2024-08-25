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

export type AdvancedPromiseBasicOptions = AsyncOptions;

export interface AdvancedPromiseCompleteOptions<T> extends AdvancedPromiseBasicOptions {
  executor?: PromiseExecutor<T>;
}

export class AdvancedPromise<T> extends Promise<T> {
  static withOptions<T>(executor: PromiseExecutor<T>, options?: AdvancedPromiseBasicOptions): AdvancedPromise<T>;
  static withOptions<T>(options?: AdvancedPromiseCompleteOptions<T>): AdvancedPromise<T>;
  static withOptions<T>(
    executorOrOptions?: PromiseExecutor<T> | AdvancedPromiseCompleteOptions<T>,
    options?: AdvancedPromiseBasicOptions,
  ): AdvancedPromise<T> {
    let executor: PromiseExecutor<T> | undefined;
    let basicOptions: AdvancedPromiseBasicOptions;

    executorOrOptions ||= {};
    if (typeof executorOrOptions === 'function') {
      executor = executorOrOptions;
      basicOptions = options || {};
    } else {
      executor = executorOrOptions.executor;
      basicOptions = executorOrOptions;
    }

    const { abortSignal } = basicOptions;
    let promise = new AdvancedPromise<T>((res, rej) => {
      if (abortSignal && abortSignal.aborted) {
        rej(createAbortError(abortSignal.reason));
      }
      executor && executor(res, rej);
    });

    const { timeout } = basicOptions;
    if (timeout) {
      // NOTE: You may wonder why we just don't create timeout via setTimeout and reject
      //  the promise via promise.reject. The reason is this approach works improperly
      //  in some environment. For example, in Vitest.
      let timeoutId: number | undefined;
      promise = new AdvancedPromise<T>((res, rej) => {
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
      promise = new AdvancedPromise((res, rej) => {
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
  ): AdvancedPromise<T | TResult> {
    return super.catch(onRejected) as AdvancedPromise<T | TResult>;
  }

  /**
   * @see Promise.finally
   */
  override finally(onFinally?: (() => void) | undefined | null): AdvancedPromise<T> {
    return super.finally(onFinally) as AdvancedPromise<T>;
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
  ): AdvancedPromise<TResult1 | TResult2> {
    return super.then(onFulfilled, onRejected) as AdvancedPromise<TResult1 | TResult2>;
  }
}
