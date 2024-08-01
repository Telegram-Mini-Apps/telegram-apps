import { subscribe, unsubscribe } from './events/listening.js';
import { createLogger } from './createLogger.js';
import type { SubscribeListener } from './events/types.js';

export const [log, error] = createLogger('Bridge', {
  bgColor: 'blue',
  textColor: 'white',
});

let debugEnabled = false;

const onEvent: SubscribeListener = ({ name, payload }) => {
  log('Event received:', payload ? { name, payload } : { name });
};

/**
 * Sets new debug mode. Enabling debug mode leads to printing additional messages in the console,
 * related to the processes inside the package.
 * @param enable - should debug be enabled.
 */
export function setDebug(enable: boolean): void {
  if (debugEnabled !== enable) {
    debugEnabled = enable;
    enable ? subscribe(onEvent) : unsubscribe(onEvent);
  }
}

/**
 * Logs info message into the console.
 * @param args - additional arguments.
 */
export function debugLog(...args: any[]): void {
  if (debugEnabled) {
    log(...args);
  }
}
