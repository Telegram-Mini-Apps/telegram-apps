import { useSyncExternalStore } from 'react';

/**
 * Returns the underlying signal value updating it each time the signal value changes.
 * @param signal - a signal.
 */
export function useSignal<T>(signal: {
  (): T;
  sub(fn: VoidFunction): VoidFunction;
}): T {
  return useSyncExternalStore((onStoreChange) => signal.sub(onStoreChange), signal);
}
