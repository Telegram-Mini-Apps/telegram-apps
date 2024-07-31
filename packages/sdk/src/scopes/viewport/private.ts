import { signal } from '@/signals/signal/signal.js';

import type { Viewport } from './types.js';

export const state = signal<Viewport.State>({
  height: 0,
  width: 0,
  isExpanded: false,
  stableHeight: 0,
});

export const isMounted = signal(false);
export const isMounting = signal(false);
export const mountError = signal<Error | undefined>(undefined);
