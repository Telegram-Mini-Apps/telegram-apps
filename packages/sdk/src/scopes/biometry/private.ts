import { signal } from '@telegram-apps/signals';
import type { CancelablePromise } from '@telegram-apps/bridge';

export const mountPromise = signal<CancelablePromise<void>>();