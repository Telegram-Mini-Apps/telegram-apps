import { computed, signal } from '@telegram-apps/signals';

import { mountPromise } from './private.js';
import type { State } from './types.js';

/* USUAL */

/**
 * Complete biometry manager state.
 */
export const state = signal<State | undefined>();

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * Error occurred while mounting the component.
 */
export const mountError = signal<Error | undefined>(undefined);

/* COMPUTED */

/**
 * True if the component is currently mounting.
 */
export const isMounting = computed<boolean>(() => !!mountPromise());
