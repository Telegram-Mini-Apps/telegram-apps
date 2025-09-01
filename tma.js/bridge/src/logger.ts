import { signal } from '@tma.js/signals';
import { createLogger, type Logger } from '@tma.js/toolkit';

import { debug } from '@/debug.js';

export const logger = signal<Logger>(createLogger('Bridge', {
  bgColor: '#9147ff',
  textColor: 'white',
  shouldLog: debug,
}));
