import { jsonParse } from '@telegram-apps/transformers';
import { CancelablePromise, type PromiseOptions } from 'better-promises';
import {
  date,
  looseObject,
  number,
  optional,
  parse,
  pipe,
  string,
  transform,
  ValiError,
} from 'valibot';

import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { invokeCustomMethod } from '@/globals.js';
import { AccessDeniedError } from '@/errors.js';

import { requestPhoneAccess } from './requestPhoneAccess.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import { sleep } from '@/utils/sleep.js';

/**
 * Requested contact information.
 */
export interface RequestedContact {
  contact: {
    user_id: number;
    phone_number: string;
    first_name: string;
    last_name?: string;
  };
  auth_date: Date;
  hash: string;
}

/**
 * Attempts to get requested contact.
 * @param options - execution options.
 * @throws {ValiError} Response has invalid structure
 */
async function getRequestedContact(options?: PromiseOptions): Promise<RequestedContact> {
  const data = await invokeCustomMethod('getRequestedContact', {}, {
    ...options,
    timeout: (options || {}).timeout || 5000,
  });

  return parse(
    pipe(
      string(),
      transform(input => {
        const result: Record<string, string | string[]> = {};

        new URLSearchParams(input).forEach((value, key) => {
          const accValue = result[key];
          if (accValue === undefined || !Array.isArray(accValue)) {
            result[key] = value;
          } else {
            accValue.push(value);
          }
        });

        return parse(
          looseObject({
            contact: pipe(
              string(),
              jsonParse(),
              looseObject({
                user_id: number(),
                phone_number: string(),
                first_name: string(),
                last_name: optional(string()),
              }),
            ),
            auth_date: pipe(
              string(),
              transform(input => new Date(Number(input) * 1000)),
              date(),
            ),
            hash: string(),
          }),
          result,
        );
      }),
    ),
    data,
  );
}

const [
  fn,
  [, requestContactPromise, isRequestingContact],
  [, requestContactError],
] = defineNonConcurrentFn(
  (options?: PromiseOptions): CancelablePromise<RequestedContact> => {
    return new CancelablePromise<RequestedContact>(async (res, _, abortSignal) => {
      const asyncOptions = { abortSignal };

      // First of all, let's try to get the requested contact. Probably, we already requested it
      // before.
      try {
        return res(await getRequestedContact(asyncOptions));
      } catch (e) {
        if (e instanceof ValiError) {
          throw e;
        }
      }

      // Then, request access to the user's phone.
      const status = await requestPhoneAccess(asyncOptions);
      if (status !== 'sent') {
        throw new AccessDeniedError('User denied access');
      }

      // Time to wait before executing the next request.
      let sleepTime = 50;

      // We are trying to retrieve the requested contact until the deadline was reached.
      while (!abortSignal.aborted) {
        try {
          return res(await getRequestedContact(asyncOptions));
        } catch (e) {
          if (e instanceof ValiError) {
            throw e;
          }
        }

        // Sleep for some time.
        await sleep(sleepTime);

        // Increase the sleep time not to kill the backend service.
        sleepTime += 50;
      }
    }, options);
  },
  'Contact is already being requested',
);

/**
 * Requests current user contact information. In contrary to requestPhoneAccess, this method
 * returns promise with contact information that rejects in case, user denied access, or request
 * failed.
 * @param options - additional options.
 * @since Mini Apps v6.9
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {AccessDeniedError} User denied access
 * @throws {ValiError} Response has invalid structure
 * @example
 * if (requestContact.isAvailable()) {
 *   const contact = await requestContact();
 * }
 */
export const requestContact = wrapSafe('requestContact', fn, {
  isSupported: 'web_app_request_phone',
});

export {
  requestContactPromise,
  requestContactError,
  isRequestingContact,
};