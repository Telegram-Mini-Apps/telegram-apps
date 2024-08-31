import { signal } from '@telegram-apps/signals';

export const $isMounted = signal(false);

export const $isConfirmationNeeded = signal(false);