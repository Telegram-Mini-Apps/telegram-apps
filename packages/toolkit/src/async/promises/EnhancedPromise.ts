import type { AsyncOptions } from '@/async/types.js';

import { CancelablePromise } from './CancelablePromise.js';
import type {
  PromiseExecutorFn,
  PromiseOnRejectedFn,
  PromiseOnFulfilledFn,
  PromiseResolveFn,
} from './types.js';
import type { Maybe } from '@/types/misc.js';

function assignResolve<P extends EnhancedPromise<any>>(
  childPromise: P,
  parentPromise: EnhancedPromise<any>,
): P {
  childPromise.resolve = parentPromise.resolve;
  return childPromise;
}

export class EnhancedPromise<Result, Resolvable = Result> extends CancelablePromise<Result> {
  /**
   * Creates a new EnhancedPromise instance using executor, resolving promise when a result
   * was returned.
   * @param fn - function returning promise result.
   * @param options - additional options.
   */
  static withFn<T>(
    fn: (abortSignal: AbortSignal) => (T | PromiseLike<T>),
    options?: AsyncOptions,
  ): EnhancedPromise<T> {
    return new EnhancedPromise<T>(
      (res, rej, abortSignal) => {
        return CancelablePromise.withFn(fn, { abortSignal }).then(res, rej);
      },
      options,
    );
  }

  /**
   * @see Promise.resolve
   */
  static override resolve<Resolvable>(): EnhancedPromise<void, Resolvable>;
  /**
   * @see Promise.resolve
   */
  static override resolve<Result, Resolvable = Result>(
    value: Result,
  ): EnhancedPromise<Result, Resolvable>;
  /**
   * @see Promise.resolve
   */
  static override resolve<Result, Resolvable = Result>(
    value?: Result,
  ): EnhancedPromise<Result, Resolvable> {
    return new EnhancedPromise(resolve => {
      resolve(value as Result);
    });
  }

  /**
   * @see Promise.reject
   */
  static override reject<Result = never, Resolvable = Result>(
    reason?: any,
  ): EnhancedPromise<Result, Resolvable> {
    return new EnhancedPromise((_, reject) => {
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
    super((res, rej, signal) => {
      resolve = res;
      executor && executor(res, rej, signal);
    }, options);

    this.resolve = resolve as unknown as PromiseResolveFn<Resolvable>;
  }

  /**
   * @see Promise.catch
   */
  override catch<CatchResult = never>(
    onRejected?: Maybe<PromiseOnRejectedFn<CatchResult>>,
  ): EnhancedPromise<Result | CatchResult, Resolvable> {
    return this.then(undefined, onRejected);
  }

  /**
   * @see Promise.finally
   */
  override finally(onFinally?: Maybe<() => void>): EnhancedPromise<Result, Resolvable> {
    return assignResolve(super.finally(onFinally) as EnhancedPromise<Result, Resolvable>, this);
  }

  /**
   * Resolves the promise.
   */
  resolve!: PromiseResolveFn<Resolvable>;

  /**
   * @see Promise.then
   */
  override then<A = Result, B = never>(
    onFulfilled?: Maybe<PromiseOnFulfilledFn<Result, A>>,
    onRejected?: Maybe<PromiseOnRejectedFn<B>>,
  ): EnhancedPromise<A | B, Resolvable> {
    return assignResolve(super.then(onFulfilled, onRejected) as EnhancedPromise<A | B, Resolvable>, this);
  }
}