import { log as utilLog } from '@tma.js/logger';

let currentDebug = false;
let currentTargetOrigin = 'https://web.telegram.org';

/**
 * Sets new debug mode. Enabling debug mode leads to printing
 * additional messages in console, related to the processes
 * inside the package.
 * @param value - should debug mode be enabled.
 */
export function setDebug(value: boolean): void {
  currentDebug = value;
}

/**
 * Sets new global targetOrigin, used by `postEvent` method.
 * Default value is "https://web.telegram.org". You don't need to
 * use this method until you know what you are doing.
 *
 * This method could be used for test purposes.
 * @param value - new target origin.
 */
export function setTargetOrigin(value: string): void {
  currentTargetOrigin = value;
}

/**
 * Returns current global target origin.
 */
export function targetOrigin(): string {
  return currentTargetOrigin;
}

/**
 * Logs message in case, debug mode is enabled.
 * @param level - log level
 * @param args - values to print.
 */
export const log: typeof utilLog = (level, ...args) => {
  if (currentDebug) {
    utilLog(level, '[Bridge]', ...args);
  }
};
