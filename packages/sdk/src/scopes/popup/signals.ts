import { signal } from '@telegram-apps/signals';

/**
 * True if a popup is currently opened.
 */
export const isOpened = signal(false);