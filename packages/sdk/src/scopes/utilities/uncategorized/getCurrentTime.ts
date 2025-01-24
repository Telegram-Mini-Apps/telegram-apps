import type { CancelablePromise } from 'better-promises';
import { date, integer, number, parse, pipe, transform } from 'valibot';
import type { InvokeCustomMethodOptions } from '@telegram-apps/bridge';

import { invokeCustomMethod } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';

/**
 * @returns Current server time.
 * @param options - execution options.
 * @since Mini Apps v6.9
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (getCurrentTime.isAvailable()) {
 *   const time = await getCurrentTime();
 * }
 */
export const getCurrentTime = wrapSafe(
  'getCurrentTime',
  (options?: InvokeCustomMethodOptions): CancelablePromise<Date> => {
    return invokeCustomMethod('getCurrentTime', {}, options).then(value => {
      return parse(
        pipe(number(), integer(), transform(v => new Date(v * 1000)), date()),
        value,
      );
    });
  },
  { isSupported: 'web_app_invoke_custom_method' },
);