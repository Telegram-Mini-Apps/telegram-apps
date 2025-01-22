import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { InvalidDataError } from '@/errors.js';
import { launchParams, postEvent } from '@/globals.js';

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
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The application must be launched in the inline mode
 * @throws {InvalidDataError} Maximum size of data to send is 4096 bytes
 * @throws {InvalidDataError} Attempted to send empty data
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
      throw new InvalidDataError(size
        ? 'Maximum size of data to send is 4096 bytes'
        : 'Attempted to send empty data');
    }
    postEvent('web_app_data_send', { data });
  },
  {
    isSupported() {
      return launchParams().tgWebAppBotInline
        ? undefined
        : 'The application must be launched in the inline mode';
    },
  },
);