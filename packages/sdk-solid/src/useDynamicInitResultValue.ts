import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';
import { useInitResultValue } from './useInitResultValue.js';
import type { SDKInitResult, SDKInitResultKey, SDKInitResultValue } from './types.js';

interface Trackable {
  on: (event: any, ...args: any[]) => void;
  off: (event: any, ...args: any[]) => void;
}

type EventName<T extends Trackable> = T extends {
  on(event: infer E, ...args: any[]): any
} ? E : never;

type DynamicComponentKey = {
  [K in SDKInitResultKey]: SDKInitResultValue<K> extends Trackable ? K : never;
}[SDKInitResultKey];

/**
 * Extracts value from the SDK init result by specified key and listens to its all specified
 * events, making the returned value to update.
 * @param initResult - SDK init result.
 * @param key - SDK init result key.
 * @param events - tracked events list.
 */
export function useDynamicInitResultValue<K extends DynamicComponentKey>(
  initResult: Accessor<SDKInitResult>,
  key: K,
  events: EventName<SDKInitResultValue<K>>[],
): Accessor<SDKInitResultValue<K>> {
  // Get original value from init result.
  const initResultValue = useInitResultValue(initResult, key);

  // Here we store value, which should always update it in case, some of its props
  // were changed/
  const [value, setValue] = createSignal(initResultValue(), { equals: false });

  createEffect(() => {
    const value = initResultValue();
    const listener = () => {
      // We use prev => prev on purpose. This will make Solid sure, something inside
      // dynamic value changed.
      setValue(prev => prev);
    };

    events.forEach(event => value.on(event, listener));
    onCleanup(() => {
      events.forEach(event => value.off(event, listener));
    });
  });

  return value;
}