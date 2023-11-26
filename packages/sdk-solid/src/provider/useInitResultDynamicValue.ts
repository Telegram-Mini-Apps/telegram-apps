import {
  type Accessor,
  createEffect,
  createSignal,
  onCleanup,
} from 'solid-js';

import { useInitResultValue } from './useInitResultValue.js';
import type {
  DynamicInitResultKey,
  InitResultValue,
  Trackable,
} from '../types.js';

export function useInitResultDynamicValue<K extends DynamicInitResultKey>(
  initResultKey: K,
): Accessor<InitResultValue<K>> {
  // Extract init result value.
  const initial = useInitResultValue(initResultKey);

  // Create value which will be returned to the external environment.
  const [signal, setSignal] = createSignal(initial(), { equals: false });

  // Effect which listens to change event and calls update.
  createEffect(() => {
    onCleanup(
      (initial() as Trackable).on('change', () => {
        setSignal((prev) => prev);
      }),
    );
  });

  return signal;
}
