import { TypedError } from '@/errors/TypedError.js';

export const ERR_ABORTED = 'ERR_ABORTED';
export const ERR_TIMED_OUT = 'ERR_TIMED_OUT';

export function createAbortError(cause?: unknown): TypedError<typeof ERR_ABORTED> {
  return new TypedError(ERR_ABORTED, { cause });
}

export function createTimeoutError(timeout: number): TypedError<typeof ERR_TIMED_OUT> {
  return new TypedError(ERR_TIMED_OUT, `Timeout reached: ${timeout}ms`)
}

/**
 * @param value - value to check.
 * @returns True if passed value is timeout error.
 */
export function isTimeoutError(value: unknown): value is TypedError<typeof ERR_TIMED_OUT> {
  return value instanceof TypedError && value.type === ERR_TIMED_OUT;
}

/**
 * @param value - value to check.
 * @returns True if passed value is abort error.
 */
export function isAbortError(value: unknown): value is TypedError<typeof ERR_ABORTED> {
  return value instanceof TypedError && value.type === ERR_ABORTED;
}