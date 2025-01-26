import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import type { RequestOptionsNoCapture } from '@/types.js';

const METHOD_NAME = 'web_app_request_phone';

const [
  fn,
  tPromise,
  tError,
] = defineNonConcurrentFn((options?: RequestOptionsNoCapture) => {
  return request(METHOD_NAME, 'phone_requested', options).then(d => d.status);
}, 'Phone access request is currently in progress');

/**
 * Requests current user phone access. Method returns promise, which resolves
 * status of the request. In case, user accepted the request, Mini App bot will receive
 * the according notification.
 *
 * To obtain the retrieved information instead, utilize the `requestContact` method.
 * @param options - additional options.
 * @since Mini Apps v6.9
 * @see requestContact
 * @throws {ConcurrentCallError} Phone access request is currently in progress
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (requestPhoneAccess.isAvailable()) {
 *   const status = await requestPhoneAccess();
 * }
 */
export const requestPhoneAccess = wrapSafe('requestPhoneAccess', fn, {
  isSupported: METHOD_NAME,
});
export const [, requestPhoneAccessPromise, isRequestingPhoneAccess] = tPromise;
export const [, requestPhoneAccessError] = tError;