import type { EventPayload } from '@telegram-apps/bridge';
import type { CancelablePromise } from 'better-promises';

import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import type { RequestOptionsNoCapture } from '@/types.js';

const METHOD_NAME = 'web_app_biometry_get_info';

/**
 * Requests biometry information.
 * @since Mini Apps v7.2
 * @param options - additional execution options.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (requestBiometry.isAvailable()) {
 *   const biometryState = await requestBiometry();
 * }
 */
export const requestBiometry = wrapSafe(
  'requestBiometry',
  (options?: RequestOptionsNoCapture): CancelablePromise<EventPayload<'biometry_info_received'>> => {
    return request(METHOD_NAME, 'biometry_info_received', options);
  },
  { isSupported: METHOD_NAME },
);
