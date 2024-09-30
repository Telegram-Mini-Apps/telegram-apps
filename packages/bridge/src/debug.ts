import { signal } from '@telegram-apps/signals';
import { createLogger } from '@telegram-apps/toolkit';

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
export const $debug = signal(false);

export const [logInfo, logError] = createLogger('Bridge', {
  bgColor: '#9147ff',
  textColor: 'white',
  shouldLog: $debug,
});
