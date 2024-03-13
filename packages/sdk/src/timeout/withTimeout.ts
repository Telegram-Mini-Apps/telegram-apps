import { TimeoutError } from './TimeoutError.js';

/**
 * Creates promise which rejects after timeout milliseconds.
 * @param timeout - timeout in milliseconds.
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, rej) => {
    setTimeout(rej, timeout, new TimeoutError(timeout));
  });
}

/**
 * Accepts specified function and instantly executes. It waits for timeout milliseconds for
 * it to complete and throws an error in case, deadline was reached.
 * @param funcOrPromise - function to execute or pending promise.
 * @param timeout - completion timeout.
 */
export function withTimeout<T>(
  funcOrPromise: Promise<T> | (() => Promise<T>),
  timeout: number,
): Promise<T> {
  return Promise.race([
    typeof funcOrPromise === 'function' ? funcOrPromise() : funcOrPromise,
    createTimeoutPromise(timeout),
  ]);
}
