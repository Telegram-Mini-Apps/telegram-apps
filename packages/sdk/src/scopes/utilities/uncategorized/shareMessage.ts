import type { AbortablePromise } from 'better-promises';

import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { request } from '@/globals.js';
import { ShareMessageError } from '@/errors.js';
import type { AsyncOptions } from '@/types.js';

const METHOD_NAME = 'web_app_send_prepared_message';

/**
 * Opens a dialog allowing the user to share a message provided by the bot.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {ShareMessageError} Message sharing failed.
 * @example
 * if (shareMessage.isAvailable()) {
 *   await shareMessage('bbhjSYgvck23');
 * }
 */
export const shareMessage = wrapSafe(
  'shareMessage',
  (id: string, options?: AsyncOptions): AbortablePromise<void> => {
    return request(METHOD_NAME, ['prepared_message_failed', 'prepared_message_sent'], {
      ...options,
      params: { id },
    }).then(data => {
      if (data && 'error' in data) {
        throw new ShareMessageError(data.error);
      }
    });
  },
  { isSupported: METHOD_NAME },
);