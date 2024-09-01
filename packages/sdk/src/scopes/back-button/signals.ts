import { signal } from '@telegram-apps/signals';

/**
 * True if the component is currently visible.
 */
export const isVisible = signal(false);

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);