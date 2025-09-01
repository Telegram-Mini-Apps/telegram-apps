import { signal } from '@tma.js/signals';

import { logger } from '@/logger.js';

export const targetOrigin = signal('https://web.telegram.org');

/**
 * Returns the target origin used by the `postEvent` method.
 *
 * You don't need to override this value until you know what you are doing.
 * @default 'https://web.telegram.org'
 */
export function getTargetOrigin(): string {
  return targetOrigin();
}

/**
 * Sets a new target origin that is being used when calling the `postEvent` function in Telegram
 * web versions.
 *
 * You don't need to override this value until you know what you are doing.
 * @param origin - allowed target origin value.
 * @see targetOrigin
 */
export function setTargetOrigin(origin: string) {
  targetOrigin.set(origin);
  logger().log('New target origin set', origin);
}
