import { batch, type Signal } from '@telegram-apps/signals';
import { type AsyncOptions, CancelablePromise, TypedError } from '@telegram-apps/bridge';
import { ERR_ALREADY_CALLED } from '@/errors.js';
import { withIsSupported } from '@/scopes/toolkit/withIsSupported.js';

/**
 * Creates a mount function for a component.
 * @param mount - function mounting the component.
 * @param onMounted - callback which will be called with the mount result.
 * @param mountPromise - signal containing mount promise.
 * @param isMounted - signal containing mount state.
 * @param mountError - signal containing mount error.
 * @param isSupported - signal containing the component support flag.
 */
// #__NO_SIDE_EFFECTS__
export function createMountFn<T = void>(
  mount: (options: AsyncOptions) => (T | CancelablePromise<T>),
  onMounted: (result: T) => void,
  {
    isMounting,
    isMounted,
    mountError,
    isSupported,
  }: {
    isMounted: Signal<boolean>,
    isMounting: Signal<boolean>,
    mountError: Signal<Error | undefined>,
    isSupported?: () => boolean,
  },
): (options?: AsyncOptions) => CancelablePromise<void> {
  return withIsSupported(mountOptions => {
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
    },
    isSupported || (() => true),
  );
}