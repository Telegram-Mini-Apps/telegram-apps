import { computed, signal } from '@telegram-apps/signals';
import { type EmojiStatusAccessRequestedStatus, TypedError } from '@telegram-apps/bridge';

import { ERR_ALREADY_REQUESTING } from '@/errors.js';
import { request } from '@/scopes/globals.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { signalifyAsyncFn } from '@/scopes/signalifyAsyncFn.js';

const METHOD = 'web_app_request_emoji_status_access';

/**
 * Signal containing the emoji status access request promise.
 */
export const requestEmojiStatusAccessPromise = signal<Promise<EmojiStatusAccessRequestedStatus> | undefined>();

/**
 * Signal containing the last emoji status access request error.
 */
export const requestEmojiStatusAccessError = signal<Error | undefined>();

/**
 * Signal indicating if the emoji status access is currently being requested.
 */
export const isRequestingEmojiStatusAccess = computed(() => !!requestEmojiStatusAccessPromise());

/**
 * Shows a native popup requesting permission for the bot to manage user's emoji status.
 * @param options - additional options.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_ALREADY_REQUESTING
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (requestEmojiStatusAccess.isAvailable()) {
 *   const status = await requestEmojiStatusAccess();
 * }
 */
export const requestEmojiStatusAccess = wrapSafe(
  'requestEmojiStatusAccess',
  signalifyAsyncFn(
    (): Promise<EmojiStatusAccessRequestedStatus> => {
      return request(METHOD, 'emoji_status_access_requested')
        .then(r => r.status);
    },
    () => new TypedError(
      ERR_ALREADY_REQUESTING,
      'Emoji status access request is currently in progress',
    ),
    requestEmojiStatusAccessPromise,
    requestEmojiStatusAccessError,
    false,
  ),
  { isSupported: METHOD },
);