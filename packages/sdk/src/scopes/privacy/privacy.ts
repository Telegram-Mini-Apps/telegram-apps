import { ExecuteWithTimeout } from '@/types/index.js';
import { searchParams } from '@/parsing/parsers/searchParams.js';
import { json } from '@/parsing/parsers/json.js';
import { number } from '@/parsing/parsers/number.js';
import { string } from '@/parsing/parsers/string.js';
import { date } from '@/parsing/parsers/date.js';
import { invokeCustomMethod } from '@/bridge/invokeCustomMethod.js';
import { createRequestId, postEvent } from '@/globals/globals.js';
import { withTimeout } from '@/timeout/withTimeout.js';
import { sleep } from '@/timeout/sleep.js';
import { createTimeoutError } from '@/timeout/createTimeoutError.js';
import { PhoneRequestedStatus, WriteAccessRequestedStatus } from '@/bridge/events/types.js';
import { request } from '@/bridge/request.js';

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

const contact = searchParams({
  contact: json({
    userId: {
      type: number(),
      from: 'user_id',
    },
    phoneNumber: {
      type: string(),
      from: 'phone_number',
    },
    firstName: {
      type: string(),
      from: 'first_name',
    },
    lastName: {
      type: string().optional(),
      from: 'last_name',
    },
  }),
  authDate: {
    type: date(),
    from: 'auth_date',
  },
  hash: string(),
}, 'RequestedContact');

private requestPhoneAccessPromise: Promise<PhoneRequestedStatus> | undefined;

private requestWriteAccessPromise: Promise<WriteAccessRequestedStatus> | undefined;

/**
 * Attempts to get requested contact.
 * @param timeout - request timeout.
 */
async function getRequestedContact({
  timeout = 10000,
}: ExecuteWithTimeout = {}): Promise<RequestedContact> {
  return contact.parse(
    await invokeCustomMethod(
      'getRequestedContact',
      {},
      createRequestId()(),
      { postEvent: postEvent(), timeout },
    ),
  );
}

/**
 * Requests current user contact information. In contrary to requestPhoneAccess, this method
 * returns promise with contact information that rejects in case, user denied access, or request
 * failed.
 * @param options - additional options.
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
    // fixme
    throw new Error('Access denied.');
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
export async function requestPhoneAccess(options: ExecuteWithTimeout = {}): Promise<PhoneRequestedStatus> {
  if (!this.requestPhoneAccessPromise) {
    this.requestPhoneAccessPromise = request({
      ...options,
      method: 'web_app_request_phone',
      event: 'phone_requested',
      postEvent: postEvent(),
    })
      .then(({ status }) => status)
      .finally(() => this.requestPhoneAccessPromise = undefined);
  }
  return this.requestPhoneAccessPromise;
}

/**
 * Requests write message access to current user.
 * @param options - additional options.
 */
export async function requestWriteAccess(options: ExecuteWithTimeout = {}): Promise<WriteAccessRequestedStatus> {
  if (!this.requestWriteAccessPromise) {
    this.requestWriteAccessPromise = request({
      ...options,
      method: 'web_app_request_write_access',
      event: 'write_access_requested',
      postEvent: postEvent(),
    })
      .then(({ status }) => status)
      .finally(() => this.requestWriteAccessPromise = undefined);
  }
  return this.requestWriteAccessPromise;
}