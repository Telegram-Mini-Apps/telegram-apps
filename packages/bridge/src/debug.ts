import { createLogger } from '@telegram-apps/toolkit';

import type { SubscribeListener } from '@/events/types/index.js';
import { off, on } from '@/events/emitter.js';

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
let debug = false;

export const [logInfo, logError] = createLogger('Bridge', {
  bgColor: '#9147ff',
  textColor: 'white',
  shouldLog() {
    return debug;
  },
});

const listener: SubscribeListener = event => {
  logInfo(false, 'Event received:', event);
};

/**
 * Sets the package debug mode leading to outputting additional logs.
 * @param value - enable debug mode.
 */
export function setDebug(value: boolean): void {
  if (value !== debug) {
    debug = value;
    debug ? on('*', listener) : off('*', listener);
  }
}
