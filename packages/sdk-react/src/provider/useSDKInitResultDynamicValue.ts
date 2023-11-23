import { useEffect, useState } from 'react';

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
): SDKInitResultValue<K> {
  // Extract global component instance.
  const initResultValue = useSDKInitResultValue(initResultKey);

  // Function which will be used in case, recreation is not required, but notification about
  // changes is still needed.
  const [, setSymbol] = useState(Symbol());

  // Effect which listens to change event and calls force update.
  useEffect(() => {
    return (initResultValue as Trackable).on('changed', () => setSymbol(Symbol()));
  }, [initResultValue]);

  return initResultValue;
}