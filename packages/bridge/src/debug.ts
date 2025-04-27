import type { SubscribeListener } from '@/events/types/index.js';
import { off, on } from '@/events/emitter.js';
import { logger } from '@/logger.js';

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
export let debug = false;

const listener: SubscribeListener = event => {
  logger().log('Event received:', event);
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
    debug ? on('*', listener) : off('*', listener);
  }
}
