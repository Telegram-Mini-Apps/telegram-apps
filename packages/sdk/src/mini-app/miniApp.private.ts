import { signal } from '@/signals/signal/signal.js';
import type { RGB } from '@/colors/types.js';

import type { HeaderColor } from './types.js';

export const backgroundColor = signal<RGB>('#000000');

export const headerColor = signal<HeaderColor>('bg_color');

export const isMounted = signal(false);