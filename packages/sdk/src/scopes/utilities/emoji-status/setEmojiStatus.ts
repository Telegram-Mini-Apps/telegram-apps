import { computed, signal } from '@telegram-apps/signals';
import {
  type AsyncOptions,
  type CancelablePromise,
  TypedError,
} from '@telegram-apps/bridge';

import { ERR_ALREADY_REQUESTING, ERR_EMOJI_STATUS_SET_FAILED } from '@/errors.js';
import { request } from '@/scopes/globals.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { signalifyAsyncFn } from '@/scopes/signalifyAsyncFn.js';

export interface SetEmojiStatusOptions extends AsyncOptions {
  /**
   * The status expiration time in seconds.
   */
  duration?: number;
}

const METHOD = 'web_app_set_emoji_status';

/**
 * Signal containing the emoji status access request promise.
 */
export const setEmojiStatusPromise = signal<CancelablePromise<void> | undefined>();

/**
 * Signal containing the last emoji status access request error.
 */
export const setEmojiStatusError = signal<Error | undefined>();

/**
 * Signal indicating if the emoji status set is currently being requested.
 */
export const isSettingEmojiStatus = computed(() => !!setEmojiStatusPromise());

/**
 * Opens a dialog allowing the user to set the specified custom emoji as their status.
 * @returns Promise with boolean value indicating if the status was set.
 * @param options - additional options.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_ALREADY_REQUESTING
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (setEmojiStatus.isAvailable()) {
 *   const statusSet = await setEmojiStatus('5361800828313167608');
 * }
 */
export const setEmojiStatus = wrapSafe(
  'setEmojiStatus',
  signalifyAsyncFn(
    (customEmojiId: string, options?: SetEmojiStatusOptions): CancelablePromise<void> => {
      options ||= {};
      return request(METHOD, ['emoji_status_set', 'emoji_status_failed'], {
        ...options,
        params: {
          custom_emoji_id: customEmojiId,
          duration: options.duration,
        },
      })
        .then(r => {
          if (r && 'error' in r) {
            throw new TypedError(ERR_EMOJI_STATUS_SET_FAILED, 'Failed to set emoji status', r.error);
          }
        });
    },
    () => new TypedError(
      ERR_ALREADY_REQUESTING,
      'Emoji status set request is currently in progress',
    ),
    setEmojiStatusPromise,
    setEmojiStatusError,
  ),
  { isSupported: METHOD },
);