import {
  captureSameReq,
  retrieveLaunchParams,
  CancelablePromise,
  TypedError,
  type ExecuteWithOptions,
  type SwitchInlineQueryChatType,
  type ExecuteWithPostEvent, supports,
} from '@telegram-apps/bridge';

import { postEvent, createRequestId, request, $version } from '@/scopes/globals.js';
import { withIsSupported } from '@/scopes/toolkit/withIsSupported.js';
import { ERR_DATA_INVALID_SIZE } from '@/errors.js';

const WEB_APP_READ_TEXT_FROM_CLIPBOARD = 'web_app_read_text_from_clipboard';
const WEB_APP_SWITCH_INLINE_QUERY = 'web_app_switch_inline_query';
const WEB_APP_SHARE_TO_STORY = 'web_app_share_to_story';

export interface ShareStoryOptions extends ExecuteWithPostEvent {
  /**
   * The caption to be added to the media.
   * 0-200 characters for regular users and 0-2048 characters for premium subscribers.
   * @see https://telegram.org/faq_premium#telegram-premium
   */
  text?: string;
  /**
   * An object that describes a widget link to be included in the story.
   * Note that only premium subscribers can post stories with links.
   * @see https://telegram.org/faq_premium#telegram-premium
   */
  widgetLink?: {
    /**
     * The URL to be included in the story.
     */
    url: string;
    /**
     * The name to be displayed for the widget link, 0-48 characters.
     */
    name?: string;
  };
}

/**
 * Reads a text from the clipboard and returns a string or null. null is returned
 * in cases:
 * - A value in the clipboard is not a text.
 * - Access to the clipboard is not granted.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const readTextFromClipboard = withIsSupported(
  (options?: ExecuteWithOptions): CancelablePromise<string | null> => {
    const reqId = createRequestId();

    return request(WEB_APP_READ_TEXT_FROM_CLIPBOARD, 'clipboard_text_received', {
      ...options,
      params: { req_id: reqId },
      capture: captureSameReq(reqId),
    }).then(({ data = null }) => data);
  }, WEB_APP_READ_TEXT_FROM_CLIPBOARD,
);

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
 * @throws {TypedError} ERR_DATA_INVALID_SIZE
 */
export function sendData(data: string): void {
  const { size } = new Blob([data]);
  if (!size || size > 4096) {
    throw new TypedError(ERR_DATA_INVALID_SIZE);
  }
  postEvent('web_app_data_send', { data });
}

/**
 * A method that opens the native story editor.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const shareStory = withIsSupported(
  (mediaUrl: string, options?: ShareStoryOptions) => {
    options ||= {};
    (options.postEvent || postEvent)(WEB_APP_SHARE_TO_STORY, {
      text: options.text,
      media_url: mediaUrl,
      widget_link: options.widgetLink,
    });
  }, WEB_APP_SHARE_TO_STORY,
);

/**
 * Inserts the bot's username and the specified inline query in the current chat's input field.
 * Query may be empty, in which case only the bot's username will be inserted. The client prompts
 * the user to choose a specific chat, then opens that chat and inserts the bot's username and
 * the specified inline query in the input field.
 * @param query - text which should be inserted in the input after the current bot name. Max
 * length is 256 symbols.
 * @param chatTypes - List of chat types which could be chosen to send the message. Could be
 * empty list.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const switchInlineQuery = withIsSupported(
  (query: string, chatTypes?: SwitchInlineQueryChatType[]) => {
    postEvent(WEB_APP_SWITCH_INLINE_QUERY, {
      query: query,
      chat_types: chatTypes || [],
    });
  },
  () => {
    return supports(WEB_APP_SWITCH_INLINE_QUERY, $version()) && !!retrieveLaunchParams().botInline;
  }
);
