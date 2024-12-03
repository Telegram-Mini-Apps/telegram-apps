import { batch, type Signal } from '@telegram-apps/signals';
import { CancelablePromise, If, type TypedError } from '@telegram-apps/bridge';
import { AnyFn } from '@/types.js';

type Signalified<Fn extends AnyFn, Cancelable extends boolean> = (...args: Parameters<Fn>) => If<
  Cancelable,
  CancelablePromise<ReturnType<Fn>>,
  PromiseLike<ReturnType<Fn>>
>;

/**
 * Function doing the following:
 * 1. Prevents the wrapped function from being called concurrently.
 * 2. Being called, updates the passed promise and error signals.
 *
 * As a result, the function returns a new one, returning a cancelable promise.
 * @param fn - function to wrap.
 * @param createPendingError - function that creates error in case of concurrent call
 * @param promise - signal containing the execution promise
 * @param error - signal containing the last call error.
 * @param cancelable - is result cancelable. True by default.
 */
export function signalifyAsyncFn<Fn extends AnyFn>(
  fn: Fn,
  createPendingError: () => TypedError<any>,
  promise: Signal<CancelablePromise<Awaited<ReturnType<Fn>>> | undefined>,
  error: Signal<Error | undefined>,
  cancelable?: true,
): Signalified<Fn, true>;

/**
 * Function doing the following:
 * 1. Prevents the wrapped function from being called concurrently.
 * 2. Being called, updates the passed promise and error signals.
 *
 * As a result, the function returns a new one, returning a non-cancelable promise.
 * @param fn - function to wrap.
 * @param createPendingError - function that creates error in case of concurrent call
 * @param promise - signal containing the execution promise
 * @param error - signal containing the last call error.
 * @param cancelable - is result cancelable. True by default.
 */
export function signalifyAsyncFn<Fn extends AnyFn>(
  fn: Fn,
  createPendingError: () => TypedError<any>,
  promise: Signal<Promise<Awaited<ReturnType<Fn>>> | undefined>,
  error: Signal<Error | undefined>,
  cancelable: false,
): Signalified<Fn, false>;

// #__NO_SIDE_EFFECTS__
export function signalifyAsyncFn<Fn extends AnyFn>(
  fn: Fn,
  createPendingError: () => TypedError<any>,
  promise:
    | Signal<CancelablePromise<Awaited<ReturnType<Fn>>> | undefined>
    | Signal<Promise<Awaited<ReturnType<Fn>>> | undefined>,
  error: Signal<Error | undefined>,
  cancelable?: boolean,
): Signalified<Fn, boolean> {
  const PromiseConstructor = cancelable === undefined || cancelable
    ? CancelablePromise
    : Promise;

  return Object.assign((...args: Parameters<Fn>): PromiseLike<ReturnType<Fn>> => {
    return PromiseConstructor
      .resolve()
      .then(async () => {
        // Check if the operation is currently not in progress.
        if (promise()) {
          const err = createPendingError();
          error.set(err);
          throw err;
        }

        // Start performing the wrapped function.
        batch(() => {
          promise.set(
            (PromiseConstructor as typeof Promise).resolve(fn(...args)) as unknown as any,
          );
          error.set(undefined);
        });
        let result: [completed: true, result: ReturnType<Fn>] | [completed: false, err: Error];
        try {
          result = [true, await promise()!];
        } catch (e) {
          result = [false, e as Error];
        }

        // Actualize the state.
        batch(() => {
          promise.set(undefined);
          error.set(result[0] ? undefined : result[1]);
        });

        // Throw an error or return result.
        if (!result[0]) {
          throw result[1];
        }
        return result[1];
      });
  }, fn);
}
