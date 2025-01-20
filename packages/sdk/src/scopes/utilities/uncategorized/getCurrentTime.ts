import type { PromiseOptions, CancelablePromise } from 'better-promises';
import { date, integer, number, parse, pipe, transform } from 'valibot';

import { invokeCustomMethod } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';

/**
 * @returns Current server time.
 * @param options - execution options.
 */
export const getCurrentTime = wrapSafe(
  'getCurrentTime',
  (options?: PromiseOptions): CancelablePromise<Date> => {
    return invokeCustomMethod('getCurrentTime', {}, options).then(value => {
      return parse(
        pipe(number(), integer(), transform(v => new Date(v * 1000)), date()),
        value,
      );
    });
  },
  { isSupported: 'web_app_invoke_custom_method' },
);