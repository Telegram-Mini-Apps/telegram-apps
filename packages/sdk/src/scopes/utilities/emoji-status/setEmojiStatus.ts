import type { RequestOptionsNoCapture } from '@/types.js';
import { SetEmojiStatusError } from '@/errors.js';
import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';

const METHOD = 'web_app_set_emoji_status';

export interface SetEmojiStatusOptions extends RequestOptionsNoCapture {
  duration?: number;
}

const [
  fn,
  tPromise,
  tError,
] = defineNonConcurrentFn(
  (customEmojiId: string, options?: SetEmojiStatusOptions) => {
    return request(METHOD, ['emoji_status_set', 'emoji_status_failed'], {
      params: {
        custom_emoji_id: customEmojiId,
        duration: (options || {}).duration,
      },
      ...options,
    })
      .then(d => {
        if (d && 'error' in d) {
          throw new SetEmojiStatusError(d.error);
        }
      });
  },
  'Emoji status set request is currently in progress',
);

/**
 * Opens a dialog allowing the user to set the specified custom emoji as their status.
 * @returns Promise with boolean value indicating if the status was set.
 * @param options - additional options.
 * @since Mini Apps v8.0
 * @throws {ConcurrentCallError} Emoji status set request is currently in progress
 * @throws {SetEmojiStatusError} Failed to set emoji status
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (setEmojiStatus.isAvailable()) {
 *   const statusSet = await setEmojiStatus('5361800828313167608');
 * }
 */
export const setEmojiStatus = wrapSafe('setEmojiStatus', fn, {
  isSupported: METHOD,
});
export const [, setEmojiStatusPromise, isSettingEmojiStatus] = tPromise;
export const [, setEmojiStatusError] = tError;