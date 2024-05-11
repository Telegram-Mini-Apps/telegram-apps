import { createTimeoutError } from '@/timeout/createTimeoutError.js';

/**
 * Runs passed function or promise with specified deadline presented via timeout argument.
 * @param funcOrPromise - function to execute or pending promise.
 * @param timeout - completion timeout.
 */
export function withTimeout<T>(
  funcOrPromise: Promise<T> | (() => Promise<T>),
  timeout: number,
): Promise<T> {
  return Promise.race([
    typeof funcOrPromise === 'function' ? funcOrPromise() : funcOrPromise,
    new Promise<never>((_, rej) => {
      setTimeout(() => {
        rej(createTimeoutError(timeout));
      }, timeout);
    }),
  ]);
}
