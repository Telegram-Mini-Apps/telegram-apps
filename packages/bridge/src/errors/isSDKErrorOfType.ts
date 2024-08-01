import { isSDKError } from './isSDKError.js';
import type { ErrorType } from './errors.js';

/**
 * Returns true if passed value is an SDK error of specified type.
 * @param value - value to check.
 * @param type - error type.
 */
export function isSDKErrorOfType(value: unknown, type: ErrorType): boolean {
  return isSDKError(value) && value.type === type;
}
