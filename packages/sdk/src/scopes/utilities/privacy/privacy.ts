import {
  TypedError,
  CancelablePromise,
  sleep,
  type PhoneRequestedStatus,
  type WriteAccessRequestedStatus,
  type ExecuteWithOptions,
} from '@telegram-apps/bridge';
import { searchParams, object, number, string, date } from '@telegram-apps/transformers';

import { invokeCustomMethod, request } from '@/scopes/globals.js';
import { withIsSupported } from '@/scopes/toolkit/withIsSupported.js';
import { ERR_ACCESS_DENIED, ERR_ALREADY_CALLED } from '@/errors.js';
import { signal } from '@telegram-apps/signals';

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

const WEB_APP_REQUEST_PHONE = 'web_app_request_phone';
const WEB_APP_REQUEST_WRITE_ACCESS = 'web_app_request_write_access';

/**
 * True if phone access is currently being requested.
 */
export const isRequestingPhoneAccess = signal(false);

/**
 * True if write access is currently being requested.
 */
export const isRequestingWriteAccess = signal(false);

/**
 * Attempts to get requested contact.
 * @param options - execution options.
 * @throws {TypedError} ERR_CUSTOM_METHOD_ERR_RESPONSE
 */
function getRequestedContact(options?: ExecuteWithOptions): CancelablePromise<RequestedContact> {
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
 * @throws {TypedError} ERR_ACCESS_DENIED
 * @throws {TypedError} ERR_CUSTOM_METHOD_ERR_RESPONSE
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const requestContact = withIsSupported(
  (options?: ExecuteWithOptions): CancelablePromise<RequestedContact> => {
    return new CancelablePromise(
      async (res, _, abortSignal) => {
        const asyncOptions = {
          postEvent: (options || {}).postEvent,
          abortSignal,
        };

        // First of all, let's try to get the requested contact.
        // Probably, we already requested it before.
        try {
          return res(await getRequestedContact(asyncOptions));
        } catch {
        }

        // Then, request access to the user's phone.
        const status = await requestPhoneAccess(asyncOptions);
        if (status !== 'sent') {
          throw new TypedError(ERR_ACCESS_DENIED);
        }

        // Time to wait before executing the next request.
        let sleepTime = 50;

        // We are trying to retrieve the requested contact until the deadline was reached.
        while (!abortSignal.aborted) {
          try {
            return res(await getRequestedContact(asyncOptions));
          } catch {
          }

          // Sleep for some time.
          await sleep(sleepTime);

          // Increase the sleep time not to kill the backend service.
          sleepTime += 50;
        }
      }, options,
    );
  },
  WEB_APP_REQUEST_PHONE,
);

/**
 * Requests current user phone access. Method returns promise, which resolves
 * status of the request. In case, user accepted the request, Mini App bot will receive
 * the according notification.
 *
 * To obtain the retrieved information instead, utilize the `requestContact` method.
 * @param options - additional options.
 * @see requestContact
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const requestPhoneAccess = withIsSupported(
  (options?: ExecuteWithOptions): Promise<PhoneRequestedStatus> => {
    if (isRequestingPhoneAccess()) {
      throw new TypedError(ERR_ALREADY_CALLED);
    }
    isRequestingPhoneAccess.set(true);

    return request(WEB_APP_REQUEST_PHONE, 'phone_requested', options)
      .then(r => r.status)
      .finally(() => {
        isRequestingPhoneAccess.set(false);
      });
  }, WEB_APP_REQUEST_PHONE,
);

/**
 * Requests write message access to the current user.
 * @param options - additional options.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const requestWriteAccess = withIsSupported(
  (options?: ExecuteWithOptions): Promise<WriteAccessRequestedStatus> => {
    if (isRequestingWriteAccess()) {
      throw new TypedError(ERR_ALREADY_CALLED);
    }
    isRequestingWriteAccess.set(true);

    return request(WEB_APP_REQUEST_WRITE_ACCESS, 'write_access_requested', options)
      .then(r => r.status)
      .finally(() => {
        isRequestingWriteAccess.set(false);
      });
  }, WEB_APP_REQUEST_WRITE_ACCESS,
);
