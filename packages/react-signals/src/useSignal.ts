import { useSyncExternalStore } from 'react';
import type { Computed } from '@telegram-apps/signals';

/**
 * Returns the underlying signal value updating it each time the signal value changes.
 * @param signal - a signal.
 */
export function useSignal<T>(signal: Computed<T>): T {
  return useSyncExternalStore(signal.sub, signal);
}
