import {
  type Accessor,
  createEffect,
  createSignal,
  onCleanup,
} from 'solid-js';

import type { SDKInitResultKey, SDKInitResultValue } from './types.js';
import { useSDKInitResultValue } from './useSDKInitResultValue.js';

type ListeningManipulator<R> = (event: 'changed', listener: () => void) => R;

interface Trackable {
  on: ListeningManipulator<() => void>;
  off: ListeningManipulator<void>;
}

export type DynamicComponentKey = {
  [K in SDKInitResultKey]: SDKInitResultValue<K> extends Trackable ? K : never;
}[SDKInitResultKey];

export function useSDKInitResultDynamicValue<K extends DynamicComponentKey>(
  initResultKey: K,
): Accessor<SDKInitResultValue<K>> {
  // Extract global component instance.
  const initResultValue = useSDKInitResultValue(initResultKey);

  // Function which will be used in case, recreation is not required, but notification about
  // changes is still needed.
  const [getValue, setValue] = createSignal(initResultValue(), {
    equals: false,
  });

  // Effect which listens to change event and calls force update.
  createEffect(() => {
    const stopListening = (initResultValue() as Trackable).on('changed', () => {
      setValue(initResultValue);
    });

    onCleanup(stopListening);
  });

  return getValue;
}
