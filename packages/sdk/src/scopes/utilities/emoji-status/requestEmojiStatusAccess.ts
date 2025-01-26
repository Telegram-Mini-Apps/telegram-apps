import type { RequestOptionsNoCapture } from '@/types.js';
import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';

const METHOD = 'web_app_request_emoji_status_access';

const [
  fn,
  tPromise,
  tError,
] = defineNonConcurrentFn((options?: RequestOptionsNoCapture) => {
  return request(METHOD, 'emoji_status_access_requested', options).then(d => d.status);
}, 'Emoji status access request is already in progress');

/**
 * Shows a native popup requesting permission for the bot to manage user's emoji status.
 * @param options - additional options.
 * @since Mini Apps v8.0
 * @throws {ConcurrentCallError} Emoji status access request is already in progress
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (requestEmojiStatusAccess.isAvailable()) {
 *   const status = await requestEmojiStatusAccess();
 * }
 */
export const requestEmojiStatusAccess = wrapSafe(
  'requestEmojiStatusAccess',
  fn,
  { isSupported: METHOD },
);
export const [, requestEmojiStatusAccessPromise, isRequestingEmojiStatusAccess] = tPromise;
export const [, requestEmojiStatusAccessError] = tError;