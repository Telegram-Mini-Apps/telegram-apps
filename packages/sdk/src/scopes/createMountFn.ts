import { batch, type Signal } from '@telegram-apps/signals';
import { type AsyncOptions, CancelablePromise, TypedError } from '@telegram-apps/bridge';
import { ERR_ALREADY_CALLED } from '@/errors.js';

/**
 * Creates a mount function for a component.
 * @param mount - function mounting the component.
 * @param onMounted - callback which will be called with the mount result.
 * @param mountPromise - signal containing mount promise.
 * @param isMounted - signal containing mount state.
 * @param mountError - signal containing mount error.
 */
// #__NO_SIDE_EFFECTS__
export function createMountFn<T = void>(
  mount: (options: AsyncOptions) => (T | CancelablePromise<T>),
  onMounted: (result: T) => void,
  {
    isMounting,
    isMounted,
    mountError,
  }: {
    isMounted: Signal<boolean>,
    isMounting: Signal<boolean>,
    mountError: Signal<Error | undefined>,
  },
): (options?: AsyncOptions) => CancelablePromise<void> {
  return function mountFn(mountOptions) {
    if (isMounted()) {
      return CancelablePromise.resolve();
    }

    if (isMounting()) {
      throw new TypedError(ERR_ALREADY_CALLED);
    }
    isMounting.set(true);

    return CancelablePromise
      .withFn((abortSignal) => mount({ abortSignal }), mountOptions)
      .then<[true, T], [false, Error]>(
        r => [true, r],
        e => [false, e],
      )
      .then(tuple => {
        batch(() => {
          isMounting.set(false);
          isMounted.set(true);

          if (tuple[0]) {
            onMounted(tuple[1]);
          } else {
            const error = tuple[1];
            mountError.set(error);
            throw error;
          }
        });
      });
  };
}