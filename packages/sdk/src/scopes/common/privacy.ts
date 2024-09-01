import {
  invokeCustomMethod,
  request,
  type PhoneRequestedStatus,
  type WriteAccessRequestedStatus,
} from '@telegram-apps/bridge';
import { searchParams, object, number, string, date } from '@telegram-apps/transformers';

import { $createRequestId, $postEvent } from '@/scopes/globals/globals.js';
import { ERR_ACCESS_DENIED } from '@/errors/errors.js';
import { withIsSupported, type WithIsSupported } from '@/scopes/withIsSupported.js';
import { SDKError } from '@/errors/SDKError.js';
import { AsyncOptions, BetterPromise, createTimeoutError, sleep } from '@telegram-apps/toolkit';

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

const REQUEST_PHONE_METHOD = 'web_app_request_phone';
const REQUEST_WRITE_ACCESS_METHOD = 'web_app_request_write_access';

let requestPhoneAccessPromise: Promise<PhoneRequestedStatus> | undefined;
let requestWriteAccessPromise: Promise<WriteAccessRequestedStatus> | undefined;

/**
 * Attempts to get requested contact.
 * @param options - execution options.
 */
function getRequestedContact(options?: AsyncOptions): BetterPromise<RequestedContact> {
  options ||= {};

  return invokeCustomMethod('getRequestedContact', {}, $createRequestId()(), {
    ...options,
    postEvent: $postEvent(),
    timeout: options.timeout || 10000,
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
 * @throws {SDKError} ERR_ACCESS_DENIED
 */
export async function requestContact(options?: AsyncOptions): Promise<RequestedContact> {
  options ||= {};
  options.timeout ||= 5000;
  const { timeout } = options;

  // First of all, let's try to get the requested contact. Probably, we already requested
  // it before.
  try {
    return await getRequestedContact(options);
  } catch { /* empty */
  }

  // Then, request access to user's phone.
  const status = await requestPhoneAccess(options);
  if (status !== 'sent') {
    throw new SDKError(ERR_ACCESS_DENIED);
  }

  // Expected deadline.
  const deadlineAt = Date.now() + timeout;

  // Time to wait before executing the next request.
  let sleepTime = 50;

  // We are trying to retrieve the requested contact until deadline was reached.
  return BetterPromise.withFn<RequestedContact>(async () => {
    while (Date.now() < deadlineAt) {
      try {
        return await getRequestedContact();
      } catch {
      }

      // Sleep for some time.
      await sleep(sleepTime);

      // Increase the sleep time not to kill the backend service.
      sleepTime += 50;
    }

    throw createTimeoutError(timeout);
  }, options);
}

/**
 * Requests current user phone access. Method returns promise, which resolves
 * status of the request. In case, user accepted the request, Mini App bot will receive
 * the according notification.
 *
 * To obtain the retrieved information instead, utilize the `requestContact` method.
 * @param options - additional options.
 * @see requestContact
 */
export const requestPhoneAccess: WithIsSupported<
  (options?: AsyncOptions) => Promise<PhoneRequestedStatus>
> = withIsSupported((options) => {
  if (!requestPhoneAccessPromise) {
    requestPhoneAccessPromise = request(REQUEST_PHONE_METHOD, 'phone_requested', {
      ...options || {},
      postEvent: $postEvent(),
    })
      .then(({ status }) => status)
      .finally(() => requestPhoneAccessPromise = undefined);
  }
  return requestPhoneAccessPromise;
}, REQUEST_PHONE_METHOD);

/**
 * Requests write message access to the current user.
 * @param options - additional options.
 */
export const requestWriteAccess: WithIsSupported<
  (options?: AsyncOptions) => Promise<WriteAccessRequestedStatus>
> = withIsSupported((options) => {
  if (!requestWriteAccessPromise) {
    requestWriteAccessPromise = request(REQUEST_WRITE_ACCESS_METHOD, 'write_access_requested', {
      ...options || {},
      postEvent: $postEvent(),
    })
      .then(({ status }) => status)
      .finally(() => requestWriteAccessPromise = undefined);
  }
  return requestWriteAccessPromise;
}, REQUEST_WRITE_ACCESS_METHOD);
