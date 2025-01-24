import { CancelablePromise } from 'better-promises';

/**
 * Awaits for specified amount of time.
 * @param duration - duration in ms to await.
 * @param abortSignal - signal to stop function execution.
 */
export function sleep(duration: number, abortSignal?: AbortSignal): CancelablePromise<void> {
  return new CancelablePromise<void>({ abortSignal, timeout: duration }).catch(() => {});
}
