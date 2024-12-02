import { signal } from '@telegram-apps/signals';

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = signal(false);