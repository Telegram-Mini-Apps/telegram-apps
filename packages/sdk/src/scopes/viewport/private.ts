import { signal } from '@/signals/signal/signal.js';

import type { Viewport } from './types.js';

/**
 * Formats value to make it stay in bounds [0, +Inf).
 * @param value - value to format.
 */
function truncate(value: number): number {
  return value < 0 ? 0 : value;
}

export const state = signal<State>({
  height: 0,
  width: 0,
  isExpanded: false,
  stableHeight: 0,
}, {
  set(s, value) {
    s.set({
      isExpanded: value.isExpanded,
      height: truncate(value.height),
      width: truncate(value.width),
      stableHeight: truncate(value.stableHeight),
    });
  },
});

export const isMounted = signal(false);
export const isMounting = signal(false);
export const mountError = signal<Error | undefined>(undefined);
