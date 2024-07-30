import { postEvent, createRequestId } from '@/scopes/globals/globals.js';
import { request } from '@/bridge/request.js';
import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { captureSameReq } from '@/bridge/captureSameReq.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import type { SwitchInlineQueryChatType } from '@/bridge/methods/types/index.js';

/*
 * fixme
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/utils
 * todo: usage
 */

const READ_TEXT_FROM_CLIPBOARD_METHOD = 'web_app_read_text_from_clipboard';
const SWITCH_INLINE_QUERY_METHOD = 'web_app_switch_inline_query';

/**
 * Reads a text from the clipboard and returns a string or null. null is returned
 * in cases:
 * - A value in the clipboard is not a text.
 * - Access to the clipboard is not granted.
 */
export const readTextFromClipboard: WithIsSupported<() => Promise<string | null>> =
  decorateWithIsSupported(async () => {
    const reqId = createRequestId()();
    const { data = null } = await request({
      method: READ_TEXT_FROM_CLIPBOARD_METHOD,
      event: 'clipboard_text_received',
      postEvent: postEvent(),
      params: { req_id: reqId },
      capture: captureSameReq(reqId),
    });

    return data;
  }, READ_TEXT_FROM_CLIPBOARD_METHOD);

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
export const switchInlineQuery: WithIsSupported<(query: string, chatTypes?: SwitchInlineQueryChatType[]) => void> =
  decorateWithIsSupported(
    (query, chatTypes?) => {
      postEvent()(SWITCH_INLINE_QUERY_METHOD, {
        query: query,
        chat_types: chatTypes || [],
      });
    },
    SWITCH_INLINE_QUERY_METHOD,
    () => !!retrieveLaunchParams().botInline,
  );
