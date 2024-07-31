import { signal } from '@/signals/signal/signal.js';

import type { State } from './types.js';

export const state = signal<State>({
  available: false,
  accessGranted: false,
  deviceId: '',
  accessRequested: false,
  tokenSaved: false,
});

export const isMounted = signal(false);
export const isMounting = signal(false);
export const mountError = signal<Error | undefined>(undefined);