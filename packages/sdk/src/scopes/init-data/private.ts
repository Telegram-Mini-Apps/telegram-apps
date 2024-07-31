import { signal } from '@/signals/signal/signal.js';

import type { InitData } from './types.js';

export const state = signal<InitData | undefined>(undefined);