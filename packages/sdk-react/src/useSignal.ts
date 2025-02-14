import { useSyncExternalStore } from 'react';

/**
 * Returns the underlying signal value updating it each time the signal value changes.
 * @param signal - a signal.
 * @param getServerSnapshot - an optional function returning the signal value snapshot. It is used only during SSR
 * to provide an initial value of the signal. When not set, defaults to the signal itself.
 */
export function useSignal<T>(
  signal: {
    (): T;
    sub(fn: VoidFunction): VoidFunction;
  },
  getServerSnapshot?: () => T
): T {
  return useSyncExternalStore(
    (onStoreChange) => signal.sub(onStoreChange),
    signal,
    getServerSnapshot || signal
  );
}
