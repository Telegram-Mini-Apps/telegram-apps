import { signal } from '@telegram-apps/signals';

/**
 * True if the invoice is currently opened.
 */
export const isOpened = signal(false);
