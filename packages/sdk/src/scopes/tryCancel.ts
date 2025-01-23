import { CancelablePromise } from 'better-promises';

/**
 * Cancels the promise stored in the signal.
 * @param signal - signal with promise.
 */
export function tryCancel(signal: () => (CancelablePromise<any> | undefined)): void {
  const p = signal();
  // Catch the promise to prevent unhandled error.
  p && p.catch(() => {}).cancel();
}