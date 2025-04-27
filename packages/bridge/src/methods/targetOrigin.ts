import { signal } from '@telegram-apps/signals';

import { logger } from '@/logger.js';

/**
 * Target origin used by the `postEvent` method.
 *
 * You don't need to override this value until you know what you are doing.
 * @default 'https://web.telegram.org'
 */
export const targetOrigin = signal('https://web.telegram.org');

/**
 * Sets a new target origin that is being used when calling the `postEvent` function in Telegram
 * web versions.
 * @param origin - allowed target origin value.
 * @see targetOrigin
 */
export function setTargetOrigin(origin: string) {
  targetOrigin.set(origin);
  logger().log('New target origin set', origin);
}