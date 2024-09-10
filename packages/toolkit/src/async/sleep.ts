import { BetterPromise } from '@/async/BetterPromise.js';

/**
 * Awaits for specified amount of time.
 * @param duration - duration in ms to await.
 * @param abortSignal - signal to stop function execution.
 */
export function sleep(duration: number, abortSignal?: AbortSignal): BetterPromise<void> {
  return new BetterPromise(r => {
    setTimeout(r, duration);
  }, { abortSignal });
}
