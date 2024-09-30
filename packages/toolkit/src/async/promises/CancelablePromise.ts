import { TypedError } from '@/errors/TypedError.js';
import { addEventListener } from '@/addEventListener.js';
import { createCbCollector } from '@/createCbCollector.js';
import { createAbortError, ERR_CANCELED, ERR_TIMED_OUT } from '@/async/errors.js';
import type { Maybe } from '@/types/misc.js';
import type { AsyncOptions } from '@/async/types.js';

import type {
  PromiseExecutorFn,
  PromiseOnRejectedFn,
  PromiseRejectFn,
  PromiseOnFulfilledFn,
  PromiseResolveFn,
} from './types.js';

function assignReject<P extends CancelablePromise<any>>(
  childPromise: P,
  parentPromise: CancelablePromise<any>,
): P {
  childPromise.reject = parentPromise.reject;
  return childPromise;
}

/**
 * Improved version of the JavaScript Promise.
 */
export class CancelablePromise<Result> extends Promise<Result> {
  /**
   * Creates a new BetterPromise instance using executor, resolving promise when a result
   * was returned.
   * @param fn - function returning promise result.
   * @param options - additional options.
   */
  static withFn<T>(
    fn: (abortSignal: AbortSignal) => (T | PromiseLike<T>),
    options?: AsyncOptions,
  ): CancelablePromise<T> {
    return new CancelablePromise((res, rej, signal) => {
      try {
        const result = fn(signal);
        return result instanceof Promise ? result.then(res, rej) : res(result);
      } catch (e) {
        rej(e);
      }
    }, options);
  }

  /**
   * @see Promise.resolve
   */
  static override resolve(): CancelablePromise<void>;
  /**
   * @see Promise.resolve
   */
  static override resolve<T>(value: T | PromiseLike<T>): CancelablePromise<Awaited<T>>;
  /**
   * @see Promise.resolve
   */
  static override resolve<T>(value?: T | PromiseLike<T>): CancelablePromise<Awaited<T>> {
    return new CancelablePromise(resolve => {
      resolve(value as Awaited<T>);
    });
  }

  /**
   * @see Promise.reject
   */
  static override reject<T = never>(reason?: any): CancelablePromise<T> {
    return new CancelablePromise((_, reject) => {
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
      resolve = withCleanup(res) as PromiseResolveFn<Result>;

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
          reject(new TypedError(ERR_TIMED_OUT, `Timeout reached: ${timeout}ms`));
        }, timeout);

        addCleanup(() => {
          clearTimeout(timeoutId);
        });
      }

      executor && executor(resolve, reject, controllerSignal);
    });

    this.reject = reject;
  }

  /**
   * Cancels the promise execution.
   */
  cancel(): void {
    this.reject(new TypedError(ERR_CANCELED));
  }

  /**
   * @see Promise.catch
   */
  override catch<CatchResult = never>(
    onRejected?: Maybe<PromiseOnRejectedFn<CatchResult>>,
  ): CancelablePromise<Result | CatchResult> {
    return this.then(undefined, onRejected);
  }

  /**
   * @see Promise.finally
   */
  override finally(onFinally?: Maybe<() => void>): CancelablePromise<Result> {
    return assignReject(super.finally(onFinally) as CancelablePromise<Result>, this);
  }

  /**
   * Rejects the promise.
   */
  reject!: PromiseRejectFn;

  /**
   * @see Promise.then
   */
  override then<A = Result, B = never>(
    onFulfilled?: Maybe<PromiseOnFulfilledFn<Result, A>>,
    onRejected?: Maybe<PromiseOnRejectedFn<B>>,
  ): CancelablePromise<A | B> {
    return assignReject(super.then(onFulfilled, onRejected) as CancelablePromise<A | B>, this);
  }
}
