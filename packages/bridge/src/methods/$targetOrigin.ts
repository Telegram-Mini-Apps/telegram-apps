import { signal } from '@telegram-apps/signals';

/**
 * Target origin used by the `postEvent` method.
 *
 * You don't need to override this value until you know what you are doing.
 * @default 'https://web.telegram.org'
 */
export const $targetOrigin = signal('https://web.telegram.org');
