import { signal } from '@telegram-apps/signals';

import type { State } from './types.js';

/**
 * Complete biometry manager state.
 */
export const state = signal<State | undefined>();

/**
 * True if the manager is currently authenticating.
 */
export const isAuthenticating = signal<boolean>(false);

/**
 * True if the manager is currently requesting access.
 */
export const isRequestingAccess = signal<boolean>(false);

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if the component is currently mounting.
 */
export const isMounting = signal<boolean>(false);

/**
 * Error occurred while mounting the component.
 */
export const mountError = signal<Error | undefined>(undefined);
