import { off, on } from '@/events/emitter.js';
import type { SubscribeListener } from '@/events/types/index.js';
import { logger } from '@/logger.js';
import { targetOrigin } from '@/methods/targetOrigin.js';

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
export let debug = false;

const eventsListener: SubscribeListener = event => {
  logger().log('Event received:', event);
};

const originListener = (origin: string) => {
  logger().log('Target origin changed:', origin);
};

/**
 * Sets the package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 * @param value - enable debug mode.
 */
export function setDebug(value: boolean): void {
  if (value !== debug) {
    debug = value;
    if (debug) {
      on('*', eventsListener);
      targetOrigin.sub(originListener);
    } else {
      off('*', eventsListener);
      targetOrigin.unsub(originListener);
    }
  }
}
