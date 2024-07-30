import { signal } from '@/signals/signal/signal.js';

export const isMounted = signal(false);

export const isConfirmationNeeded = signal(false);