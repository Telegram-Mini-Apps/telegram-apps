import { batch, type Computed } from '@telegram-apps/signals';
import { CancelablePromise, type PromiseOptions } from 'better-promises';

import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import { createSignalsTuple, type SignalsTuple } from '@/signals-registry.js';

/**
 * Creates a mount function for a component.
 * @param component - the component name
 * @param mount - function mounting the component
 * @param onMounted - function that will be called whenever mount was completed.
 */
// #__NO_SIDE_EFFECTS__
export function defineMountFn<R>(
  component: string,
  mount: (abortSignal?: AbortSignal) => R | Promise<R>,
  onMounted: (result: R) => void,
): [
  fn: (options?: PromiseOptions) => CancelablePromise<void>,
  promise: [
    ...SignalsTuple<CancelablePromise<Awaited<R>> | undefined>,
    isRequesting: Computed<boolean>,
  ],
  error: SignalsTuple<Error | undefined>,
  isMounted: SignalsTuple<boolean>,
] {
  const [
    fn,
    ...rest
  ] = defineNonConcurrentFn(mount, `The ${component} component is already mounting`);
  const [_isMounted, isMounted] = createSignalsTuple(false);

  return [
    (options?: PromiseOptions) => {
      return CancelablePromise.withFn(async abortSignal => {
        if (!isMounted()) {
          const result = await fn(abortSignal);
          batch(() => {
            _isMounted.set(true);
            onMounted(result);
          });
        }
      }, options);
    },
    ...rest,
    [_isMounted, isMounted],
  ];
}
