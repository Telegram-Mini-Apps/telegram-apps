import { signal } from '@telegram-apps/signals';
import type { CancelablePromise } from '@telegram-apps/toolkit';

export const authenticatePromise = signal<CancelablePromise<string | undefined>>();

export const requestAccessPromise = signal<CancelablePromise<boolean>>();

export const mountPromise = signal<CancelablePromise<void>>();