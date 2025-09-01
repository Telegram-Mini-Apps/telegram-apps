import { signal } from '@tma.js/signals';

import { off, on } from '@/events/emitter.js';
import type { SubscribeListener } from '@/events/types/index.js';
import { logger } from '@/logger.js';

export const debug = signal(false);

const eventsListener: SubscribeListener = event => {
  logger().log('Event received:', event);
};

/**
 * Returns the current debug mode state.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
export function getDebug(): boolean {
  return debug();
}

/**
 * Sets the package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 * @param value - enable debug mode.
 */
export function setDebug(value: boolean): void {
  if (value !== debug()) {
    debug.set(value);
    (value ? on : off)('*', eventsListener);
  }
}
