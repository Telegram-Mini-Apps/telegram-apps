import { batch, type Signal } from '@telegram-apps/signals';
import {
  type AsyncOptions,
  CancelablePromise,
  TypedError,
} from '@telegram-apps/bridge';

import { ERR_ALREADY_MOUNTING } from '@/errors.js';

/**
 * Creates a mount function for a component.
 * @param component - the component name.
 * @param mount - function mounting the component.
 * @param onMounted - callback which will be called with the mount result.
 * @param mountPromise - signal containing mount promise.
 * @param isMounted - signal containing mount state.
 * @param mountError - signal containing mount error.
 */
// #__NO_SIDE_EFFECTS__
export function createMountFn<T = void>(
  component: string,
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
  return mountOptions => {
    return CancelablePromise.withFn(async abortSignal => {
      if (isMounted()) {
        return;
      }
      if (isMounting()) {
        throw new TypedError(
          ERR_ALREADY_MOUNTING,
          `The ${component} component is already mounting`,
        );
      }
      isMounting.set(true);

      let result: [completed: true, result: T] | [completed: false, err: Error];
      try {
        result = [true, await mount({ abortSignal })];
      } catch (e) {
        result = [false, e as Error];
      }
      batch(() => {
        isMounting.set(false);
        isMounted.set(true);

        if (result[0]) {
          onMounted(result[1]);
        } else {
          const error = result[1];
          mountError.set(error);
          throw error;
        }
      });
    }, mountOptions);
  };
}