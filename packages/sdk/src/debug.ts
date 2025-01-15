import { setDebug as setBridgeDebug } from '@telegram-apps/bridge';
import { createLogger } from '@telegram-apps/toolkit';

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
let debug = false;

export const [logInfo, logError] = createLogger('SDK', {
  bgColor: 'forestgreen',
  textColor: 'white',
  shouldLog() {
    return debug;
  },
});

/**
 * Sets the package debug mode leading to outputting additional logs.
 * @param value - enable debug mode.
 */
export function setDebug(value: boolean): void {
  debug = value;
  setBridgeDebug(value);
}