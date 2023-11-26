import { useEffect, useState } from 'react';

import { useInitResultValue } from './useInitResultValue.js';
import type {
  DynamicInitResultKey,
  InitResultValue,
  Trackable,
} from '../types.js';

function shallowCopy<T>(value: T): T {
  return Object.create(
    Object.getPrototypeOf(value),
    Object.getOwnPropertyDescriptors(value),
  );
}

export function useInitResultDynamicValue<K extends DynamicInitResultKey>(
  initResultKey: K,
): InitResultValue<K> {
  // Extract init result value.
  const initial = useInitResultValue(initResultKey);

  // Create value which will be returned to the external environment.
  const [proxy, setCopy] = useState(shallowCopy(initial));

  // Effect which listens to change event and calls update.
  useEffect(() => {
    return (initial as Trackable).on('change', () => {
      setCopy(shallowCopy(initial));
    });
  }, [initial]);

  return proxy;
}
