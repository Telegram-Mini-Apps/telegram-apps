import { createError } from '@/errors/createError.js';
import { ERR_DATA_INVALID_SIZE } from '@/errors/errors.js';
import { postEvent, createRequestId } from '@/globals/globals.js';
import { request } from '@/bridge/request.js';
import { decorateWithSupports } from '@/components/decorateWithSupports.js';
import { captureSameReq } from '@/bridge/captureSameReq.js';
import type { SwitchInlineQueryChatType } from '@/bridge/methods/types/index.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

/*
 * fixme
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/utils
 * todo: usage
 */

const READ_TEXT_FROM_CLIPBOARD_METHOD = 'web_app_read_text_from_clipboard';
const SWITCH_INLINE_QUERY_METHOD = 'web_app_switch_inline_query';

/**
 * Closes the Mini App.
 * @param returnBack - Should the client return to the previous activity.
 */
export function close(returnBack?: boolean): void {
  postEvent()('web_app_close', { return_back: returnBack });
}

/**
 * Reads a text from the clipboard and returns a string or null. null is returned
 * in cases:
 * - A value in the clipboard is not a text.
 * - Access to the clipboard is not granted.
 */
export const readTextFromClipboard = decorateWithSupports(
  async (): Promise<string | null> => {
    const reqId = createRequestId()();
    const { data = null } = await request({
      method: READ_TEXT_FROM_CLIPBOARD_METHOD,
      event: 'clipboard_text_received',
      postEvent: postEvent(),
      params: { req_id: reqId },
      capture: captureSameReq(reqId),
    });

    return data;
  },
  READ_TEXT_FROM_CLIPBOARD_METHOD,
);

/**
 * Informs the Telegram app that the Mini App is ready to be displayed.
 *
 * It is recommended to call this method as early as possible, as soon as all essential
 * interface elements loaded.
 *
 * Once this method is called, the loading placeholder is hidden and the Mini App shown.
 *
 * If the method is not called, the placeholder will be hidden only when the page was fully loaded.
 */
export function ready(): void {
  postEvent()('web_app_ready');
}

/**
 * A method used to send data to the bot.
 *
 * When this method called, a service message sent to the bot containing the data of the length
 * up to 4096 bytes, and the Mini App closed.
 *
 * See the field `web_app_data` in the class [Message](https://core.telegram.org/bots/api#message).
 *
 * This method is only available for Mini Apps launched via a Keyboard button.
 * @param data - data to send to bot.
 * @throws {SDKError} ERR_DATA_INVALID_SIZE
 * @see ERR_DATA_INVALID_SIZE
 */
export function sendData(data: string): void {
  const { size } = new Blob([data]);
  if (!size || size > 4096) {
    throw createError(ERR_DATA_INVALID_SIZE);
  }
  postEvent()('web_app_data_send', { data });
}

/**
 * Inserts the bot's username and the specified inline query in the current chat's input field.
 * Query may be empty, in which case only the bot's username will be inserted. The client prompts
 * the user to choose a specific chat, then opens that chat and inserts the bot's username and
 * the specified inline query in the input field.
 * @param query - text which should be inserted in the input after the current bot name. Max
 * length is 256 symbols.
 * @param chatTypes - List of chat types which could be chosen to send the message. Could be
 * empty list.
 */
export const switchInlineQuery = decorateWithSupports(
  (query: string, chatTypes?: SwitchInlineQueryChatType[]): void => {
    postEvent()(SWITCH_INLINE_QUERY_METHOD, {
      query: query,
      chat_types: chatTypes || [],
    });
  },
  SWITCH_INLINE_QUERY_METHOD,
  () => !!retrieveLaunchParams().botInline,
);
