import {
  CancelablePromise,
  addEventListener,
  type AsyncOptions,
  EnhancedPromise,
} from '@telegram-apps/toolkit';

/**
 * Performs window.history.go operation waiting for it to be completed.
 * @param delta - history change delta.
 * @param options - additional options.
 */
export function historyGo(delta: number, options?: AsyncOptions): CancelablePromise<boolean> {
  if (delta === 0) {
    return CancelablePromise.resolve(true);
  }

  // We expect the popstate event to occur during some time.
  // Yeah, this seems tricky and not stable, but it seems like we have no other way out.
  // Waiting for Navigation API to be implemented in browsers.
  const promise = new EnhancedPromise<boolean>(options);
  const removePopstateListener = addEventListener(window, 'popstate', () => {
    promise.resolve(true);
  });

  window.history.go(delta);

  // Usually, it takes about 1ms to emit this event, but we use some buffer.
  setTimeout(() => promise.resolve(false), 50);

  return promise.finally(removePopstateListener);
}
