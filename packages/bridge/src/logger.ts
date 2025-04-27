import { createLogger, type Logger } from '@telegram-apps/toolkit';
import { signal } from '@telegram-apps/signals';

import { debug } from '@/debug.js';

export const logger = signal<Logger>(createLogger('Bridge', {
  bgColor: '#9147ff',
  textColor: 'white',
  shouldLog() {
    return debug;
  },
}));
