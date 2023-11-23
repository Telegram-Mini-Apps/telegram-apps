import { TimeoutError } from './TimeoutError.js';

/**
 * Returns true in case, passed value is TimeoutError.
 * @param value - checked value.
 */
export function isTimeoutError(value: unknown): value is TimeoutError {
  return value instanceof TimeoutError;
}
