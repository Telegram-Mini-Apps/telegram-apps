import { Maybe } from '@/types/misc.js';

export type PromiseResolveFn<T> = (value: T | PromiseLike<T>) => void;
export type PromiseRejectFn = (reason?: any) => void;
export type AdvancedPromiseExecutor<T> = (res: PromiseResolveFn<T>, rej: PromiseRejectFn) => any;

export interface AdvancedPromiseOptions<T> {
  abortSignal?: AbortSignal;
  executor?: AdvancedPromiseExecutor<T>;
}

export interface AdvancedPromise<T> {
  /**
   * Cancels the promise execution.
   */
  cancel(): void;
  /**
   * @see Promise.catch
   */
  catch<TResult = never>(
    onRejected?: Maybe<(reason: any) => TResult | PromiseLike<TResult>>,
  ): AdvancedPromise<T | TResult>;
  /**
   * @see Promise.finally
   */
  finally(onFinally?: Maybe<() => void>): AdvancedPromise<T>;
  /**
   * Rejects current promise using specified value.
   */
  reject: PromiseRejectFn;
  /**
   * Resolves current promise using specified value.
   */
  resolve: PromiseResolveFn<T>;
  /**
   * @see Promise.then
   */
  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: Maybe<(value: T) => TResult1 | PromiseLike<TResult1>>,
    onRejected?: Maybe<(reason: any) => TResult2 | PromiseLike<TResult2>>,
  ): AdvancedPromise<TResult1 | TResult2>;
}

export function advancedPromise<T>(executor?: AdvancedPromiseExecutor<T>): AdvancedPromise<T>;
export function advancedPromise<T>(options?: AdvancedPromiseOptions<T>): AdvancedPromise<T>;
export function advancedPromise<T>(
  executorOrOptions?: AdvancedPromiseExecutor<T> | AdvancedPromiseOptions<T>,
): AdvancedPromise<T> {
  executorOrOptions ||= {};
  let resolve!: PromiseResolveFn<T>;
  let reject!: PromiseRejectFn;

  let executor: AdvancedPromiseExecutor<T> | undefined;
  let abortSignal: AbortSignal | undefined;

  if (typeof executorOrOptions === 'object') {
    executor = executorOrOptions.executor;
    abortSignal = executorOrOptions.abortSignal;
  } else {
    executor = executorOrOptions;
  }

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
    executor && executor(res, rej);
  });

  // todo: abort?

  return {
    cancel() {
      this.reject(new Error('Cancelled'));
    },
    catch(onRejected) {
      return this.then(undefined, onRejected);
    },
    finally(onFinally): AdvancedPromise<T> {
      return advancedPromise({
        abortSignal,
        executor(res, rej) {
          promise
            .finally(onFinally)
            .then(res)
            .catch(rej);
        },
      });
    },
    reject,
    resolve,
    then<TResult1 = T, TResult2 = never>(
      onFulfilled?: Maybe<(value: T) => TResult1 | PromiseLike<TResult1>>,
      onRejected?: Maybe<(reason: any) => TResult2 | PromiseLike<TResult2>>,
    ) {
      return advancedPromise<TResult1 | TResult2>({
        abortSignal,
        executor(res, rej) {
          promise
            .then(onFulfilled, onRejected)
            .then(res)
            .catch(rej);
        },
      });
    },
  };
}
