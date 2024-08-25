import { AdvancedPromise } from '@/async/AdvancedPromise.js';

/**
 * Awaits for specified amount of time.
 * @param duration - duration in ms to await.
 * @param abortSignal - signal to stop function execution.
 */
export function sleep(duration: number, abortSignal?: AbortSignal): AdvancedPromise<void> {
  return AdvancedPromise.withOptions((res) => {
    setTimeout(res, duration);
  }, {
    abortSignal,
  });
}
