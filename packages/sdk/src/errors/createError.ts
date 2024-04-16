import { SDKError } from '@/errors/SDKError.js';

import type { ErrorType } from './errors.js';

/**
 * Creates new error using specified type and message.
 * @param type - error code.
 * @param message - error message.
 * @param cause - original error.
 */
export function createError(type: ErrorType, message: string, cause?: unknown): SDKError {
  return new SDKError(type, message, cause);
}
