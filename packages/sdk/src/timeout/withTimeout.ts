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
 * @param func - function to execute.
 * @param timeout - completion timeout.
 */
export function withTimeout<T>(func: () => Promise<T>, timeout: number): Promise<T> {
  return Promise.race([
    func(),
    createTimeoutPromise(timeout),
  ]);
}
