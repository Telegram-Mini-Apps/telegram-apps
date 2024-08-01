import { BridgeError } from '@/errors/BridgeError.js';
import { createError } from '@/errors/createError.js';
import { ERR_TIMED_OUT } from '@/errors/errors.js';

/**
 * Creates new timeout error.
 * @param timeout - timeout in ms.
 */
export function createTimeoutError(timeout: number): BridgeError {
  return createError(ERR_TIMED_OUT, `Timeout reached: ${timeout}ms`);
}
