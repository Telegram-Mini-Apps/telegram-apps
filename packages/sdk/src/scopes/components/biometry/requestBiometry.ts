import type { ExecuteWithOptions, CancelablePromise } from '@telegram-apps/bridge';

import { request } from '@/scopes/globals.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';

import { eventToState } from './eventToState.js';
import type { State } from './types.js';

const GET_INFO_METHOD = 'web_app_biometry_get_info';

/**
 * Requests biometry information.
 * @since Mini Apps v7.2
 * @param options - additional execution options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (requestBiometry.isAvailable()) {
 *   const biometryState = await requestBiometry();
 * }
 */
export const requestBiometry = wrapSafe(
  'requestBiometry',
  (options?: ExecuteWithOptions): CancelablePromise<State> => {
    return request(GET_INFO_METHOD, 'biometry_info_received', options).then(eventToState);
  },
  {
    isSupported: GET_INFO_METHOD,
  },
);
