import { batch, type Signal } from '@telegram-apps/signals';
import {
  type AsyncOptions,
  CancelablePromise,
  type TypedError,
} from '@telegram-apps/toolkit';

type AllowedFn<R> = (options?: AsyncOptions) => CancelablePromise<R>;

// #__NO_SIDE_EFFECTS__
export function signalifyAsyncFn<Fn extends AllowedFn<Result>, Result>(
  fn: Fn,
  createPendingError: () => TypedError<any>,
  isCompleted: Signal<boolean>,
  promise: Signal<CancelablePromise<Result> | undefined>,
  error: Signal<Error | undefined>,
): Fn {
  return Object.assign((options?: AsyncOptions): CancelablePromise<Result> => {
    return CancelablePromise
      .resolve()
      .then(async () => {
        // Check if the operation is currently not in progress.
        if (promise()) {
          throw createPendingError();
        }

        // Perform the operation.
        let result: [completed: true, result: Result] | [completed: false, err: Error];
        try {
          promise.set(fn(options));
          result = [true, await promise()!];
        } catch (e) {
          result = [false, e as Error];
        }

        batch(() => {
          promise.set(undefined);

          if (result[0]) {
            isCompleted.set(true);
          } else {
            error.set(result[1]);
          }
        });

        if (!result[0]) {
          throw result[1];
        }
        return result[1];
      });
  }, fn);
}
