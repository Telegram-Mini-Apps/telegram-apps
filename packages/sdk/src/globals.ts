import { Logger } from './logger/Logger.js';

let currentTargetOrigin = 'https://web.telegram.org';

export const logger = new Logger('[SDK]', false);

/**
 * Sets new debug mode. Enabling debug mode leads to printing
 * additional messages in console, related to the processes
 * inside the package.
 * @param value - should debug mode be enabled.
 */
export function setDebug(value: boolean): void {
  if (value) {
    logger.enable();
    return;
  }
  logger.disable();
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
