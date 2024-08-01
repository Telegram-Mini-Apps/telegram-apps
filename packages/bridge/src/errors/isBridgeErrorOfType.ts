import { isBridgeError } from '@/errors/isBridgeError.js';
import type { ErrorType } from '@/errors/errors.js';

/**
 * Returns true if passed value is a Bridge error of the specified type.
 * @param value - value to check.
 * @param type - error type.
 */
export function isBridgeErrorOfType(value: unknown, type: ErrorType): boolean {
  return isBridgeError(value) && value.type === type;
}
