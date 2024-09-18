import { batch, type Signal } from '@telegram-apps/signals';
import { type AsyncOptions, CancelablePromise } from '@telegram-apps/bridge';

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
  mount: (options?: AsyncOptions) => (T | CancelablePromise<T>),
  onMounted: (result: T) => void,
  {
    mountPromise,
    isMounted,
    mountError,
  }: {
    isMounted: Signal<boolean>,
    mountPromise: Signal<CancelablePromise<void> | undefined>,
    mountError: Signal<Error | undefined>,
  },
): (options?: AsyncOptions) => CancelablePromise<void> {
  return function mountFn(mountOptions) {
    let promise = mountPromise();
    if (promise) {
      return promise;
    }

    if (isMounted()) {
      return CancelablePromise.resolve();
    }

    promise = CancelablePromise
      .resolve(mount(mountOptions))
      .then<[true, T], [false, Error]>(result => [true, result], e => [false, e])
      .then(tuple => {
        batch(() => {
          let error: Error | undefined;

          if (tuple[0]) {
            onMounted(tuple[1]);
            isMounted.set(true);
          } else {
            error = tuple[1];
          }

          mountError.set(error);
          mountPromise.set(undefined);

          if (error) {
            throw error;
          }
        });
      });
    mountPromise.set(promise);

    return promise;
  };
}