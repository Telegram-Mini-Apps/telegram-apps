import { advancedPromise, addEventListener, type AdvancedPromise } from '@telegram-apps/utils';

/**
 * Performs window.history.go operation waiting for it to be completed.
 * @param delta - history change delta.
 * @param abortSignal - signal to abort the operation.
 */
export function historyGo(delta: number, abortSignal?: AbortSignal): AdvancedPromise<boolean> {
  if (delta === 0) {
    return advancedPromise(r => r(true));
  }

  // We expect the popstate event to occur during some time.
  // Yeah, this seems tricky and not stable, but it seems like we have no other way out.
  // Waiting for Navigation API to be implemented in browsers.
  const promise = advancedPromise<boolean>({ abortSignal });
  const removePopstateListener = addEventListener(window, 'popstate', () => {
    promise.resolve(true);
  });

  window.history.go(delta);

  // Usually, it takes about 1ms to emit this event, but we use some buffer.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  setTimeout(promise.resolve, 50, false);

  return promise.finally(removePopstateListener);
}
