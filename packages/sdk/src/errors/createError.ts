import type { ErrorType } from './errors.js';
import { SDKError } from './SDKError.js';

/**
 * Creates new error using specified type and message.
 * @param type - error code.
 * @param message - error message.
 * @param cause - original error.
 */
export function createError(type: ErrorType, message: string, cause?: unknown): SDKError {
  return new SDKError(type, message, cause);
}
