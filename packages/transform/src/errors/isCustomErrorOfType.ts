import { isCustomError } from './isCustomError.js';
import type { ErrorType } from './errors.js';

/**
 * Returns true if passed value is a custom error of the specified type.
 * @param value - value to check.
 * @param type - error type.
 */
export function isCustomErrorOfType(value: unknown, type: ErrorType): boolean {
  return isCustomError(value) && value.type === type;
}
