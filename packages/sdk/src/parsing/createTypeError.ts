import { createError } from '@/errors/createError.js';
import { ERR_UNEXPECTED_TYPE } from '@/errors/errors.js';
import type { SDKError } from '@/errors/SDKError.js';

/**
 * Creates instance of TypeError stating, that value has unexpected type.
 */
export function createTypeError(): SDKError {
  return createError(ERR_UNEXPECTED_TYPE, 'Value has unexpected type');
}
