import { signal } from '@telegram-apps/signals';
import type { BetterPromise } from '@telegram-apps/toolkit';

export const authenticatePromise = signal<BetterPromise<string | undefined>>();

export const requestAccessPromise = signal<BetterPromise<boolean>>();

export const mountPromise = signal<BetterPromise<void>>();