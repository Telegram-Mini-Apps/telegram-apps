import { computed, signal } from '@telegram-apps/signals';

import { subscribe, unsubscribe } from '@/events/listening.js';
import { createLogger } from '@/utils/createLogger.js';
import type { SubscribeListener } from '@/events/types.js';

export const [log, error] = createLogger('Bridge', {
  bgColor: 'blue',
  textColor: 'white',
});

const _debug = signal(false);

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
export const debug = computed(_debug);

const onEvent: SubscribeListener = ({ name, payload }) => {
  log('Event received:', payload ? { name, payload } : { name });
};

/**
 * Logs info message into the console.
 * @param args - additional arguments.
 */
export function debugLog(...args: any[]): void {
  _debug() && log(...args);
}

/**
 * Sets debug mode.
 * @param v - enable debug.
 */
export function setDebug(v: boolean): void {
  if (_debug() !== v) {
    v ? subscribe(onEvent) : unsubscribe(onEvent);
    _debug.set(v);
  }
}
