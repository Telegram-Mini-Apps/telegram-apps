import {
  type AsyncOptions,
  CancelablePromise,
  sleep,
  TypedError,
} from '@telegram-apps/bridge';
import { date, number, object, searchParams, string } from '@telegram-apps/transformers';

import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { invokeCustomMethod } from '@/scopes/globals.js';
import { ERR_ACCESS_DENIED } from '@/errors.js';

import { REQUEST_PHONE_METHOD, requestPhoneAccess } from './requestPhoneAccess.js';

/**
 * Requested contact information.
 */
export interface RequestedContact {
  contact: {
    userId: number;
    phoneNumber: string;
    firstName: string;
    lastName?: string;
  };
  authDate: Date;
  hash: string;
}

/**
 * Attempts to get requested contact.
 * @param options - execution options.
 * @throws {TypedError} ERR_CUSTOM_METHOD_ERR_RESPONSE
 */
function getRequestedContact(options?: AsyncOptions): CancelablePromise<RequestedContact> {
  options ||= {};
  return invokeCustomMethod('getRequestedContact', {}, {
    ...options,
    timeout: options.timeout || 5000,
  })
    .then(
      searchParams({
        contact: object({
          userId: ['user_id', number()],
          phoneNumber: ['phone_number', string()],
          firstName: ['first_name', string()],
          lastName: ['last_name', string(true)],
        })(),
        authDate: ['auth_date', date()],
        hash: string(),
      })(),
    );
}

/**
 * Requests current user contact information. In contrary to requestPhoneAccess, this method
 * returns promise with contact information that rejects in case, user denied access, or request
 * failed.
 * @param options - additional options.
 * @since Mini Apps v6.9
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_ACCESS_DENIED
 * @throws {TypedError} ERR_CUSTOM_METHOD_ERR_RESPONSE
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (requestContact.isAvailable()) {
 *   const contact = await requestContact();
 * }
 */
export const requestContact = wrapSafe(
  'requestContact',
  (options?: AsyncOptions): CancelablePromise<RequestedContact> => {
    return CancelablePromise.withFn(
      async (abortSignal) => {
        const asyncOptions = { abortSignal };

        // First of all, let's try to get the requested contact.
        // Probably, we already requested it before.
        try {
          return await getRequestedContact(asyncOptions);
        } catch {
        }

        // Then, request access to the user's phone.
        const status = await requestPhoneAccess(asyncOptions);
        if (status !== 'sent') {
          throw new TypedError(ERR_ACCESS_DENIED, 'User denied access');
        }

        // Time to wait before executing the next request.
        let sleepTime = 50;

        // We are trying to retrieve the requested contact until the deadline was reached.
        while (!abortSignal.aborted) {
          try {
            return await getRequestedContact(asyncOptions);
          } catch {
          }

          // Sleep for some time.
          await sleep(sleepTime);

          // Increase the sleep time not to kill the backend service.
          sleepTime += 50;
        }

        // Reachable code, but the promise will be rejected and this result will be
        // ignored.
        return null as any;
      }, options,
    );
  },
  {
    isSupported: REQUEST_PHONE_METHOD,
  },
);