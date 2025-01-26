import { batch, type Computed } from '@telegram-apps/signals';
import { AbortablePromise } from 'better-promises';

import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import { createSignalsTuple, type SignalsTuple } from '@/signals-registry.js';

/**
 * Creates a mount function for a component.
 * @param component - the component name
 * @param mount - function mounting the component
 * @param onMounted - function that will be called whenever mount was completed.
 */
// #__NO_SIDE_EFFECTS__
export function defineMountFn<Fn extends (...args: any) => AbortablePromise<any>>(
  component: string,
  mount: Fn,
  onMounted: (result: Awaited<ReturnType<Fn>>) => void,
): [
  fn: (...args: Parameters<Fn>) => AbortablePromise<void>,
  promise: [
    ...SignalsTuple<AbortablePromise<Awaited<ReturnType<Fn>>> | undefined>,
    isRequesting: Computed<boolean>,
  ],
  error: SignalsTuple<Error | undefined>,
  isMounted: SignalsTuple<boolean>,
] {
  const [fn, ...rest] =
    defineNonConcurrentFn(mount, `The ${component} component is already mounting`);
  const [_isMounted, isMounted] = createSignalsTuple(false);

  return [
    (...args) => isMounted()
      ? AbortablePromise.resolve()
      : fn(...args).then(data => {
        batch(() => {
          _isMounted.set(true);
          onMounted(data);
        });
      }),
    ...rest,
    [_isMounted, isMounted],
  ];
}
