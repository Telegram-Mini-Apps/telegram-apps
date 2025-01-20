import { batch, type Signal } from '@telegram-apps/signals';
import { CancelablePromise, type PromiseOptions } from 'better-promises';

import { ConcurrentCallError } from '@/errors.js';
import { signalifyFn } from '@/scopes/signalifyFn.js';

/**
 * Creates a mount function for a component.
 * @param component - the component name
 * @param mount - function mounting the component
 * @param onMounted - function that will be called whenever mount was completed.
 * @param $isMounted - signal containing the current mount completion state
 * @param $promise - signal containing the mount promise
 * @param $error - signal containing the mount error
 */
// #__NO_SIDE_EFFECTS__
export function createMountFn<R>(
  component: string,
  mount: (options?: PromiseOptions) => R | CancelablePromise<R>,
  onMounted: (result: R) => void,
  $isMounted: Signal<boolean>,
  $promise: Signal<CancelablePromise<R> | undefined>,
  $error: Signal<Error | undefined>,
): (options?: PromiseOptions) => CancelablePromise<void> {
  const noConcurrent = signalifyFn(
    mount,
    () => {
      return new ConcurrentCallError(`The ${component} component is already mounting`);
    },
    $promise,
    $error,
  );

  return (options?) => {
    return CancelablePromise.resolve().then(async () => {
      if (!$isMounted()) {
        const result = await noConcurrent(options);
        batch(() => {
          $isMounted.set(true);
          onMounted(result);
        });
      }
    });
  };
}
