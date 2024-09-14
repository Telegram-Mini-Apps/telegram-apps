import { signal } from '@telegram-apps/signals';

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if vertical swipes are enabled.
 */
export const isVerticalEnabled = signal(false);