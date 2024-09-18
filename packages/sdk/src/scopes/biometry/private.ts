import { signal } from '@telegram-apps/signals';
import type { CancelablePromise } from '@telegram-apps/bridge';

export const authenticatePromise = signal<CancelablePromise<string | undefined>>();

export const requestAccessPromise = signal<CancelablePromise<boolean>>();

export const mountPromise = signal<CancelablePromise<void>>();