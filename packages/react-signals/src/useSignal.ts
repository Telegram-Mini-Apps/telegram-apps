import { computed, type Computed } from '@telegram-apps/signals';
import { useMemo, useSyncExternalStore } from 'react';

/**
 * Returns the underlying signal value updating it each time the signal value changes.
 * @param signal - a signal.
 */
export function useSignal<T>(signal: () => T): [value: T, signal: Computed<T>] {
  const c = useMemo(() => computed(signal), []);
  return [useSyncExternalStore(c.sub, c), c];
}