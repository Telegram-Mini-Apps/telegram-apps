import type { ExecuteWithOptions } from '@telegram-apps/bridge';

import { SetEmojiStatusError } from '@/errors.js';
import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';

const METHOD = 'web_app_set_emoji_status';

export interface SetEmojiStatusOptions extends ExecuteWithOptions {
  duration?: number;
}

const [
  fn,
  [, promise, isRequesting],
  [, error],
] = defineNonConcurrentFn(
  async (customEmojiId: string, options?: SetEmojiStatusOptions) => {
    const data = await request(METHOD, ['emoji_status_set', 'emoji_status_failed'], {
      params: {
        custom_emoji_id: customEmojiId,
        duration: (options || {}).duration,
      },
      ...options,
    });
    if (data && 'error' in data) {
      throw new SetEmojiStatusError(data.error);
    }
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
export const setEmojiStatus = wrapSafe(
  'setEmojiStatus',
  fn,
  { isSupported: METHOD },
);

export {
  isRequesting as isSettingEmojiStatus,
  promise as setEmojiStatusPromise,
  error as setEmojiStatusError,
};