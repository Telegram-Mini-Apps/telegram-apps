import { createLogger, debug } from '@telegram-apps/bridge';

export const [loggerLog, loggerError] = createLogger('SDK', {
  bgColor: 'forestgreen',
  textColor: 'white',
});

/**
 * Logs info message into the console.
 * @param args - additional arguments.
 */
export function debugLog(...args: any[]): void {
  debug() && loggerLog(...args);
}
