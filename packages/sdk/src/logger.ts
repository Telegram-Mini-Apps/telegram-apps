import { createLogger, type Logger } from '@telegram-apps/toolkit';
import { signal } from '@telegram-apps/signals';

import { debug } from '@/debug.js';

export type { Logger };
export const logger = signal<Logger>(createLogger('Bridge', {
  bgColor: 'forestgreen',
  textColor: 'white',
  shouldLog() {
    return debug;
  },
}));
