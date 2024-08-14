import { signal } from '@telegram-apps/signals';
import type { InitData } from '@telegram-apps/bridge';

export const state = signal<InitData | undefined>(undefined);