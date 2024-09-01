import { signal } from '@telegram-apps/signals';

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if the confirmation dialog should be shown while the user is trying to close the Mini App.
 */
export const isConfirmationNeeded = signal(false);