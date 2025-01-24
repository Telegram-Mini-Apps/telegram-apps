import type { CancelablePromise } from 'better-promises';
import { ignoreCanceled } from '@/utils/ignoreCanceled.js';

/**
 * Cancels the promise stored in the signal.
 * @param signal - signal with promise.
 */
export function signalCancel(signal: () => (CancelablePromise<any> | undefined)): void {
  const p = signal();
  p && p.catch(ignoreCanceled).cancel();
}