import { CustomError } from './CustomError.js';

/**
 * @returns True, if passed value is an instance of CustomError.
 * @param value - value to check.
 */
export function isCustomError(value: unknown): value is CustomError {
  return value instanceof CustomError;
}
