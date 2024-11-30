import { computed, signal } from '@telegram-apps/signals';
import type { CancelablePromise } from '@telegram-apps/toolkit';

import type { State } from './types.js';

/**
 * Complete biometry manager state.
 */
export const state = signal<State>({ available: false});

/**
 * True if the manager is currently authenticating.
 */
export const isAuthenticating = signal<boolean>(false);

/**
 * True if the manager is currently requesting access.
 */
export const isRequestingAccess = signal<boolean>(false);

//#region Mount.

/**
 * Signal indicating if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * Signal indicating if the component is currently mounting.
 */
export const isMounting = computed(() => !!mountPromise());

/**
 * Signal containing the error occurred during mount.
 */
export const mountError = signal<Error | undefined>();

/**
 * Signal containing the mount process promise.
 */
export const mountPromise = signal<CancelablePromise<State> | undefined>();

//#endregion

/**
 * Signal indicating biometry is available.
 */
export const isAvailable = computed(() => {
  const s = state();
  return s && s.available;
});
