import { signal } from '@telegram-apps/signals';
import { type AsyncOptions, type PhoneRequestedStatus, TypedError } from '@telegram-apps/bridge';

import { ERR_ALREADY_REQUESTING } from '@/errors.js';
import { request } from '@/scopes/globals.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';

export const REQUEST_PHONE_METHOD = 'web_app_request_phone';

/**
 * Signal indicating if phone access is currently being requested.
 */
export const isRequestingPhoneAccess = signal(false);

/**
 * Requests current user phone access. Method returns promise, which resolves
 * status of the request. In case, user accepted the request, Mini App bot will receive
 * the according notification.
 *
 * To obtain the retrieved information instead, utilize the `requestContact` method.
 * @param options - additional options.
 * @since Mini Apps v6.9
 * @see requestContact
 * @throws {TypedError} ERR_ALREADY_REQUESTING
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (requestPhoneAccess.isAvailable()) {
 *   const status = await requestPhoneAccess();
 * }
 */
export const requestPhoneAccess = wrapSafe(
  'requestPhoneAccess',
  (options?: AsyncOptions): Promise<PhoneRequestedStatus> => {
    if (isRequestingPhoneAccess()) {
      throw new TypedError(ERR_ALREADY_REQUESTING, 'Phone access request is currently in progress');
    }
    isRequestingPhoneAccess.set(true);

    return request(REQUEST_PHONE_METHOD, 'phone_requested', options)
      .then(r => r.status)
      .finally(() => {
        isRequestingPhoneAccess.set(false);
      });
  },
  {
    isSupported: REQUEST_PHONE_METHOD,
  },
);