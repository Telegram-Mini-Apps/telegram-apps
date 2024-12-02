import { computed, signal } from '@telegram-apps/signals';
import type { CancelablePromise } from '@telegram-apps/bridge';

import { State } from '../types.js';

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
export const mountError = signal<Error | undefined>(undefined);

/**
 * Signal containing the mount process promise.
 */
export const mountPromise = signal<CancelablePromise<State> | undefined>();