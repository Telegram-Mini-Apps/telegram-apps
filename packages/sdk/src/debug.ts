import { $debug, createLogger } from '@telegram-apps/bridge';

export const [logInfo, logError] = createLogger('SDK', {
  bgColor: 'forestgreen',
  textColor: 'white',
  shouldLog: $debug,
});
