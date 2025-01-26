import { AbortablePromise } from 'better-promises';

/**
 * Awaits for specified amount of time.
 * @param duration - duration in ms to await.
 * @param abortSignal - signal to stop function execution.
 */
export function sleep(duration: number, abortSignal?: AbortSignal): AbortablePromise<void> {
  return new AbortablePromise<void>({ abortSignal, timeout: duration }).catch(() => {});
}
