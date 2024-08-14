import { signal } from '@telegram-apps/signals';

import type { State } from './types.js';

export const state = signal<State>({
  height: 0,
  width: 0,
  isExpanded: false,
  stableHeight: 0,
});
export const isMounted = signal(false);
export const isMounting = signal(false);
export const isCssVarsBound = signal(false);
export const mountError = signal<Error | undefined>(undefined);
