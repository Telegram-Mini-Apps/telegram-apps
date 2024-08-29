import { computed, signal, type SubscribeListenerFn } from '@telegram-apps/signals';

import { createLogger } from '@telegram-apps/toolkit';
import { subscribe } from '@/events/listening/subscribe.js';
import { unsubscribe } from '@/events/listening/unsubscribe.js';
import type { LastEvent } from '@/events/lastEvent.js';

export const [log, error] = createLogger('Bridge', {
  bgColor: 'blue',
  textColor: 'white',
});

export const $_debug = signal(false);

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
export const $debug = computed($_debug);

const onEvent: SubscribeListenerFn<LastEvent | undefined> = (e) => {
  if (e) {
    const [name, payload] = e;
    log('Event received:', payload ? { name, payload } : { name });
  }
};

/**
 * Logs info message into the console.
 * @param args - additional arguments.
 */
export function debugLog(...args: any[]): void {
  $_debug() && log(...args);
}

/**
 * Sets debug mode.
 * @param v - enable debug.
 */
export function setDebug(v: boolean): void {
  if ($_debug() !== v) {
    v ? subscribe(onEvent) : unsubscribe(onEvent);
    $_debug.set(v);
  }
}
