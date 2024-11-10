import type { AsyncOptions, CancelablePromise } from '@telegram-apps/bridge';
import { date } from '@telegram-apps/transformers';

import { invokeCustomMethod } from '@/scopes/globals.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';

/**
 * @returns Current server time.
 * @param options - execution options.
 */
export const getCurrentTime = wrapSafe(
  'getCurrentTime',
  (options?: AsyncOptions): CancelablePromise<Date> => {
    return invokeCustomMethod('getCurrentTime', {}, options).then(date());
  },
  {
    isSupported: 'web_app_invoke_custom_method',
  },
);