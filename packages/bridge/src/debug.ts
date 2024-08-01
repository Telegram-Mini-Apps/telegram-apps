import { signal } from '@telegram-apps/signals';

import { subscribe, unsubscribe } from '@/events/listening.js';
import { createLogger } from '@/utils/createLogger.js';
import type { SubscribeListener } from '@/events/types.js';

export const [log, error] = createLogger('Bridge', {
  bgColor: 'blue',
  textColor: 'white',
});

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
export const debug = signal(false, {
  set(s, v) {
    if (s() !== v) {
      v ? subscribe(onEvent) : unsubscribe(onEvent);
      s.set(v);
    }
  },
});

const onEvent: SubscribeListener = ({ name, payload }) => {
  log('Event received:', payload ? { name, payload } : { name });
};

/**
 * Logs info message into the console.
 * @param args - additional arguments.
 */
export function debugLog(...args: any[]): void {
  debug() && log(...args);
}
