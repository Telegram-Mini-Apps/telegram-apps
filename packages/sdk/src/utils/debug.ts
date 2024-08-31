import { $debug } from '@telegram-apps/bridge';
import { createLogger } from '@telegram-apps/toolkit';

export const [logInfo, logError] = createLogger('SDK', {
  bgColor: 'forestgreen',
  textColor: 'white',
  shouldLog: $debug,
});
