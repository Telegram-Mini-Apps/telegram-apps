import { signal } from '@telegram-apps/signals';

import type { State } from './types.js';

export const state = signal<State>({
  backgroundColor: '#000000',
  isActive: true,
  isLoaderVisible: false,
  isVisible: false,
  text: '',
  textColor: '#000000',
});

export const isMounted = signal(false);