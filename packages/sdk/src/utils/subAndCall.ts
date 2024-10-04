import type { Signal } from '@telegram-apps/signals';

/**
 * Calls the function and subscribes it to the specified signal.
 *
 * We usually use this function in components' mount methods when we need not only to add
 * a signal change listener, but also call it. For example, to post the actual component state
 * to the Telegram application.
 * @param signal - signal to add change listener to.
 * @param fn - listener to add and call.
 */
export function subAndCall<T>(signal: Pick<Signal<T>, 'sub'>, fn: () => void) {
  fn();
  signal.sub(fn);
}