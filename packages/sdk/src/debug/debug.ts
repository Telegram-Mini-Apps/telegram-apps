import { subscribe, unsubscribe } from '@/bridge/events/listening.js';
import { createLogger } from '@/logger/createLogger.js';
import type { SubscribeListener } from '@/bridge/events/types.js';

export const [loggerLog, loggerError] = createLogger('SDK', {
  bgColor: 'forestgreen',
  textColor: 'white',
});

let debugEnabled = false;

const onEvent: SubscribeListener = ({ name, payload }) => {
  loggerLog('Event received:', payload ? { name, payload } : { name });
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
export function log(...args: any[]): void {
  if (debugEnabled) {
    loggerError(...args);
  }
}
