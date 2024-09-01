import { signal } from '@telegram-apps/signals';

/**
 * True if the scanner is currently opened.
 */
export const isOpened = signal(false);