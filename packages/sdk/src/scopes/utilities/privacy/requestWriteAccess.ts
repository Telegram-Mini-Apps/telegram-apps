import type { WriteAccessRequestedStatus } from '@telegram-apps/bridge';
import type { CancelablePromise } from 'better-promises';

import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import type { RequestOptionsNoCapture } from '@/types.js';

const METHOD_NAME = 'web_app_request_write_access';

const [
  fn,
  [, requestWriteAccessPromise, isRequestingWriteAccess],
  [, requestWriteAccessError],
] = defineNonConcurrentFn(
  (options?: RequestOptionsNoCapture): CancelablePromise<WriteAccessRequestedStatus> => {
    return request(METHOD_NAME, 'write_access_requested', options).then(d => d.status);
  },
  'Write access request is currently in progress',
);

/**
 * Requests write message access to the current user.
 * @param options - additional options.
 * @since Mini Apps v6.9
 * @throws {ConcurrentCallError} Write access request is currently in progress
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (requestWriteAccess.isAvailable()) {
 *   const status = await requestWriteAccess();
 * }
 */
export const requestWriteAccess = wrapSafe('requestWriteAccess', fn, {
  isSupported: METHOD_NAME,
});
export { requestWriteAccessPromise, requestWriteAccessError, isRequestingWriteAccess };
