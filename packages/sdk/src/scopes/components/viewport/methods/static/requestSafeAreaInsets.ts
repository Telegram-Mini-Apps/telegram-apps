import type { AsyncOptions } from '@telegram-apps/bridge';

import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { request } from '@/scopes/globals.js';

import { REQUEST_SAFE_AREA_METHOD } from '../../const.js';

/**
 * Requests the actual viewport safe area insets information.
 * @param options - request options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v8.0
 * @example
 * if (requestSafeAreaInsets.isAvailable()) {
 *   const insets = await requestSafeAreaInsets();
 * }
 */
export const requestSafeAreaInsets = wrapSafe(
  'requestSafeAreaInsets',
  (options?: AsyncOptions) => request(REQUEST_SAFE_AREA_METHOD, 'safe_area_changed', options),
  { isSupported: REQUEST_SAFE_AREA_METHOD },
);