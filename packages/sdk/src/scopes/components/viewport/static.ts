import type { AbortablePromise } from 'better-promises';
import type { EventPayload } from '@telegram-apps/bridge';

import { request } from '@/globals.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';
import type { RequestOptionsNoCapture } from '@/types.js';

import {
  COMPONENT_NAME,
  CSA_CHANGED_EVENT,
  SA_CHANGED_EVENT,
  VIEWPORT_CHANGED_EVENT,
} from './const.js';

const REQUEST_SA_METHOD_NAME = 'web_app_request_content_safe_area';
const wrapSafe = createWrapSupported(COMPONENT_NAME, REQUEST_SA_METHOD_NAME);

/**
 * Requests the actual viewport content safe area insets information.
 * @param options - request options.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @since Mini Apps v8.0
 * @example
 * if (requestContentSafeAreaInsets.isAvailable()) {
 *   const insets = await requestContentSafeAreaInsets();
 * }
 */
export const requestContentSafeAreaInsets = wrapSafe(
  'requestContentSafeAreaInsets',
  (options?: RequestOptionsNoCapture): AbortablePromise<EventPayload<'content_safe_area_changed'>> => {
    return request(REQUEST_SA_METHOD_NAME, CSA_CHANGED_EVENT, options);
  },
);

/**
 * Requests viewport actual information from the Telegram application.
 * @param options - request options.
 * @example
 * if (requestViewport.isAvailable()) {
 *   const viewport = await requestViewport();
 * }
 */
export function requestViewport(
  options?: RequestOptionsNoCapture,
): AbortablePromise<EventPayload<'viewport_changed'>> {
  return request('web_app_request_viewport', VIEWPORT_CHANGED_EVENT, options);
}

/**
 * Requests the actual viewport safe area insets information.
 * @param options - request options.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @since Mini Apps v8.0
 * @example
 * if (requestSafeAreaInsets.isAvailable()) {
 *   const insets = await requestSafeAreaInsets();
 * }
 */
export const requestSafeAreaInsets = wrapSafe(
  'requestSafeAreaInsets',
  (options?: RequestOptionsNoCapture): AbortablePromise<EventPayload<'safe_area_changed'>> => {
    return request(REQUEST_SA_METHOD_NAME, SA_CHANGED_EVENT, options);
  },
);