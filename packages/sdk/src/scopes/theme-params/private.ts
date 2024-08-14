import { signal } from '@telegram-apps/signals';
import type { ThemeParams } from '@telegram-apps/bridge';

export const state = signal<ThemeParams>({});
export const isMounted = signal(false);
export const isCssVarsBound = signal(false);