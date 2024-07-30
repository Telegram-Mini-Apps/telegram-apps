import { signal } from '@/signals/signal/signal.js';

import type { ThemeParams } from './types.js';

export const state = signal<ThemeParams>({});

export const isMounted = signal(false);