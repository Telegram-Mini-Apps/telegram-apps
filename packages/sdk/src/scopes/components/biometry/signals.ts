import { createComputed, createSignalsTuple } from '@/signals-registry.js';

import type { State } from './types.js';

/**
 * Complete biometry manager state.
 */
export const [_state, state] = createSignalsTuple<State>({
  available: false,
  type: '',
  accessGranted: false,
  accessRequested: false,
  deviceId: '',
  tokenSaved: false,
});

/**
 * Signal indicating biometry is available.
 */
export const isAvailable = createComputed(() => _state().available);
