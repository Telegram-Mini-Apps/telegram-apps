import { TimeoutError } from './TimeoutError.js';

type AnyAsyncFunction = (...args: any[]) => Promise<any>;

/**
 * Creates promise which rejects after timeout milliseconds.
 * @param timeout - timeout in milliseconds.
 */
function createTimeoutPromise(timeout: number): Promise<void> {
  return new Promise((_, rej) => {
    setTimeout(rej, timeout, new TimeoutError(timeout));
  });
}

/**
 * Rejects specified promise in case, it is processed more than timeout seconds.
 * @param promise - wrapped promise.
 * @param timeout - timeout in milliseconds.
 */
export function withTimeout<P extends Promise<any>>(promise: P, timeout: number): P;
/**
 * Wraps async function in function using timeout.
 * @param func - wrapped function.
 * @param timeout - async function timeout.
 */
export function withTimeout<F extends AnyAsyncFunction>(func: F, timeout: number): F;
export function withTimeout(funcOrPromise: Promise<any> | AnyAsyncFunction, timeout: number) {
  if (typeof funcOrPromise === 'function') {
    return (...args: any[]) => Promise.race([
      funcOrPromise(...args),
      createTimeoutPromise(timeout),
    ]);
  }

  return Promise.race([funcOrPromise, createTimeoutPromise(timeout)]);
}
