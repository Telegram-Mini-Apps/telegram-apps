import {
  invokeCustomMethod,
  withTimeout,
  request,
  sleep,
  createTimeoutError,
  type ExecuteWithTimeout,
  type PhoneRequestedStatus,
  type WriteAccessRequestedStatus,
} from '@telegram-apps/bridge';
import { searchParams, object, number, string, date } from '@telegram-apps/transform';

import { $createRequestId, $postEvent } from '@/scopes/globals/globals.js';
import { createError } from '@/errors/createError.js';
import { ERR_ACCESS_DENIED } from '@/errors/errors.js';
import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';

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
async function getRequestedContact(options?: ExecuteWithTimeout): Promise<RequestedContact> {
  return searchParams({
    contact: object({
      userId: ['user_id', number()],
      phoneNumber: ['phone_number', string()],
      firstName: ['first_name', string()],
      lastName: ['last_name', string(true)],
    })(),
    authDate: ['auth_date', date()],
    hash: string(),
  }, 'RequestedContact')()(
    await invokeCustomMethod(
      'getRequestedContact',
      {},
      $createRequestId()(),
      { postEvent: $postEvent(), timeout: (options || {}).timeout || 10000 },
    ),
  );
}

/**
 * Requests current user contact information. In contrary to requestPhoneAccess, this method
 * returns promise with contact information that rejects in case, user denied access, or request
 * failed.
 * @param options - additional options.
 * @throws {SDKError} ERR_ACCESS_DENIED
 * @see ERR_ACCESS_DENIED
 */
export async function requestContact({ timeout = 5000 }: ExecuteWithTimeout = {}): Promise<RequestedContact> {
  // First of all, let's try to get the requested contact. Probably, we already requested
  // it before.
  try {
    return await getRequestedContact();
  } catch { /* empty */
  }

  // Then, request access to user's phone.
  const status = await requestPhoneAccess();
  if (status !== 'sent') {
    throw createError(ERR_ACCESS_DENIED);
  }

  // Expected deadline.
  const deadlineAt = Date.now() + timeout;

  // Time to wait before executing the next request.
  let sleepTime = 50;

  // We are trying to retrieve the requested contact until deadline was reached.
  return withTimeout(async () => {
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
  }, timeout);
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
  (options?: ExecuteWithTimeout) => Promise<PhoneRequestedStatus>
> = decorateWithIsSupported((options) => {
  if (!requestPhoneAccessPromise) {
    requestPhoneAccessPromise = request({
      ...options || {},
      method: REQUEST_PHONE_METHOD,
      event: 'phone_requested',
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
  (options?: ExecuteWithTimeout) => Promise<WriteAccessRequestedStatus>
> = decorateWithIsSupported((options) => {
  if (!requestWriteAccessPromise) {
    requestWriteAccessPromise = request({
      ...options,
      method: REQUEST_WRITE_ACCESS_METHOD,
      event: 'write_access_requested',
      postEvent: $postEvent(),
    })
      .then(({ status }) => status)
      .finally(() => requestWriteAccessPromise = undefined);
  }
  return requestWriteAccessPromise;
}, REQUEST_WRITE_ACCESS_METHOD);
