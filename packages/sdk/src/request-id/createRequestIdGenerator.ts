import type { CreateRequestIdFn } from './types.js';

/**
 * Creates function which generated request identifiers.
 */
export function createRequestIdGenerator(): CreateRequestIdFn {
  let requestId = 0;
  return () => (requestId += 1).toString();
}
