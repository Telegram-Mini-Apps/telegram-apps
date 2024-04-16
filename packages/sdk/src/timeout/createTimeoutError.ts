import { createError } from '@/errors/createError.js';
import { ERROR_TIMED_OUT } from '@/errors/errors.js';
import type { SDKError } from '@/errors/SDKError.js';

/**
 * Creates new timeout error.
 * @param timeout - timeout in ms.
 */
export function createTimeoutError(timeout: number): SDKError {
  return createError(ERROR_TIMED_OUT, `Timeout reached: ${timeout}ms`);
}
