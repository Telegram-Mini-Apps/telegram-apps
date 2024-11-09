import { TypedError } from '@telegram-apps/bridge';

import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { ERR_DATA_INVALID_SIZE } from '@/errors.js';
import { postEvent } from '@/scopes/globals.js';

/**
 * Sends data to the bot.
 *
 * When this method called, a service message sent to the bot containing the data of the length
 * up to 4096 bytes, and the Mini App closed.
 *
 * See the field `web_app_data` in the class [Message](https://core.telegram.org/bots/api#message).
 *
 * This method is only available for Mini Apps launched via a Keyboard button.
 * @param data - data to send to bot.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_DATA_INVALID_SIZE
 * @example
 * if (sendData.isAvailable()) {
 *   sendData('Here comes my data');
 * }
 */
export const sendData = wrapSafe(
  'sendData',
  (data: string): void => {
    const { size } = new Blob([data]);
    if (!size || size > 4096) {
      throw new TypedError(ERR_DATA_INVALID_SIZE, size
        ? 'Maximum size of data to send is 4096 bytes'
        : 'Attempted to send empty data');
    }
    postEvent('web_app_data_send', { data });
  },
);