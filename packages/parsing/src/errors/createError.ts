import { CustomError } from './CustomError.js';
import type { ErrorType } from './errors.js';

/**
 * Creates a new error using the specified type and message.
 * @param type - error code.
 * @param message - error message.
 * @param cause - original error.
 */
export function createError(type: ErrorType, message?: string, cause?: unknown): CustomError {
  return new CustomError(type, message || type, cause);
}
