import { TypedError } from '@/errors/TypedError.js';
import { addEventListener } from '@/addEventListener.js';
import { createTimeoutError } from './timeout.js';
import type { Maybe } from '@/types/misc.js';

export type PromiseResolveFn<T> = (value: T | PromiseLike<T>) => void;
export type PromiseRejectFn = (reason?: any) => void;
export type PromiseExecutor<T> = (res: PromiseResolveFn<T>, rej: PromiseRejectFn) => any;

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
  constructor(executor: PromiseExecutor<T>, options?: AdvancedPromiseBasicOptions)
  constructor(options?: AdvancedPromiseCompleteOptions<T>);
  constructor(
    executorOrOptions?: PromiseExecutor<T> | AdvancedPromiseCompleteOptions<T>,
    options?: AdvancedPromiseBasicOptions,
  ) {
    let resolve!: PromiseResolveFn<T>;
    let reject!: PromiseRejectFn;

    let executor: PromiseExecutor<T> | undefined;
    let basicOptions: AdvancedPromiseBasicOptions;

    if (typeof executorOrOptions === 'function') {
      executor = executorOrOptions;
      basicOptions = options || {};
    } else {
      executorOrOptions ||= {};
      executor = executorOrOptions.executor;
      basicOptions = executorOrOptions;
    }

    super((res, rej) => {
      resolve = res;
      reject = rej;
      executor && executor(res, rej);
    });
    this.resolve = resolve;
    this.reject = reject;

    const { timeout, abortSignal } = basicOptions;
    if (timeout) {
      const timeoutId = setTimeout(() => {
        reject(createTimeoutError(timeout));
      }, timeout);
      this.finally(() => {
        clearTimeout(timeoutId);
      });
    }

    if (abortSignal) {
      this.abortSignal = abortSignal;

      function abort() {
        reject(new TypedError('ERR_ABORTED', abortSignal!.reason));
      }

      abortSignal.aborted
        ? abort()
        : this.finally(addEventListener(abortSignal, 'abort', abort));
    }
  }

  private readonly abortSignal?: AbortSignal;

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
    onRejected?: Maybe<(reason: any) => TResult | PromiseLike<TResult>>,
  ): AdvancedPromise<T | TResult> {
    return this.then(undefined, onRejected);
  }

  /**
   * @see Promise.finally
   */
  override finally(onFinally: (() => void) | undefined | null): AdvancedPromise<T> {
    return new AdvancedPromise((res, rej) => {
      super.finally(onFinally).then(res).catch(rej);
    }, {
      abortSignal: this.abortSignal,
      timeout: this.timeout,
    });
  };

  /**
   * Resolves the promise.
   */
  resolve: PromiseResolveFn<T>;

  /**
   * Rejects the promise.
   */
  reject: PromiseRejectFn;

  /**
   * @see Promise.then
   */
  override then<TResult1 = T, TResult2 = never>(
    onFulfilled?: Maybe<(value: T) => TResult1 | PromiseLike<TResult1>>,
    onRejected?: Maybe<(reason: any) => TResult2 | PromiseLike<TResult2>>,
  ): AdvancedPromise<TResult1 | TResult2> {
    return new AdvancedPromise((res, rej) => {
      super.then(onFulfilled, onRejected).then(res).catch(rej);
    }, {
      abortSignal: this.abortSignal,
      timeout: this.timeout,
    });
  }

  /**
   * Timeout after which the promise will be rejected.
   */
  private readonly timeout?: number;
}
