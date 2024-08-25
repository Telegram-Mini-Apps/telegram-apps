import { TypedError } from '@/errors/TypedError.js';
import { addEventListener } from '@/addEventListener.js';
import type { Maybe } from '@/types/misc.js';

import { createTimeoutError, createAbortError } from './errors.js';

export type PromiseResolveFn<T> = (value: T | PromiseLike<T>) => void;
export type PromiseRejectFn = (reason?: any) => void;
export type PromiseExecutor<T> = (res: PromiseResolveFn<T>, rej: PromiseRejectFn) => any;
export type PromiseOnFulfilledFn<TResult1, TResult2> = (value: TResult1) => TResult2 | PromiseLike<TResult2>;
export type PromiseOnRejectedFn<T> = (value: any) => T | PromiseLike<T>;

export interface AdvancedPromiseBasicOptions {
  /**
   * Allows aborting the promise execution.
   */
  abortSignal?: AbortSignal;
  /**
   * Execution timeout.
   */
  timeout?: number;
}

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

    const promise = new AdvancedPromise(executor);

    let timeoutId: number | undefined;
    let removeAbortListener: (() => void) | undefined;
    const { timeout, abortSignal } = basicOptions;
    if (timeout) {
      timeoutId = (setTimeout as typeof window.setTimeout)(() => {
        promise.reject(createTimeoutError(timeout));
      }, timeout);
    }

    if (abortSignal) {
      function onAborted() {
        promise.reject(createAbortError(abortSignal!.reason));
      }

      if (abortSignal.aborted) {
        onAborted();
      } else {
        removeAbortListener = addEventListener(abortSignal, 'abort', onAborted);
      }
    }

    return removeAbortListener || timeoutId
      ? promise.finally(() => {
        removeAbortListener && removeAbortListener();
        timeoutId && clearTimeout(timeoutId);
      })
      : promise;
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
