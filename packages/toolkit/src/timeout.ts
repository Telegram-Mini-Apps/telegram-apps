import { TypedError } from '@/errors/TypedError.js';

export const ERR_TIMED_OUT = 'ERR_TIMED_OUT';

/**
 * Runs passed function or promise with the specified deadline presented via the timeout argument.
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
        rej(new TypedError('ERR_TIMED_OUT', `Timeout reached: ${timeout}ms`));
      }, timeout);
    }),
  ]);
}

/**
 * @param value - value to check.
 * @returns True if passed value is timeout error.
 */
export function isTimeoutError(value: unknown): value is TypedError<typeof ERR_TIMED_OUT> {
  return value instanceof TypedError && value.type === ERR_TIMED_OUT;
}