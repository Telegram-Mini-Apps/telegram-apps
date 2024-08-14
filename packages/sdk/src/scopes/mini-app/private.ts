import { signal } from '@telegram-apps/signals';
import type { RGB } from '@telegram-apps/bridge';

import type { HeaderColor } from './types.js';

export const backgroundColor = signal<RGB>('#000000');

export const headerColor = signal<HeaderColor>('bg_color');

export const isMounted = signal(false);
export const isCssVarsBound = signal(false);