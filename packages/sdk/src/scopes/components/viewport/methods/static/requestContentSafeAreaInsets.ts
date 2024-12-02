import type { AsyncOptions } from '@telegram-apps/bridge';

import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { request } from '@/scopes/globals.js';

import { REQUEST_CONTENT_SAFE_AREA_METHOD } from '../../const.js';

/**
 * Requests the actual viewport content safe area insets information.
 * @param options - request options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v8.0
 * @example
 * if (requestContentSafeAreaInsets.isAvailable()) {
 *   const insets = await requestContentSafeAreaInsets();
 * }
 */
export const requestContentSafeAreaInsets = wrapSafe(
  'requestContentSafeAreaInsets',
  (options?: AsyncOptions) => request(REQUEST_CONTENT_SAFE_AREA_METHOD, 'content_safe_area_changed', options),
  { isSupported: REQUEST_CONTENT_SAFE_AREA_METHOD },
);
