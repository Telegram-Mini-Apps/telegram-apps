import type { SwitchInlineQueryChatType } from '@telegram-apps/bridge';

import { $launchParams, postEvent } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';

const SWITCH_INLINE_QUERY_METHOD = 'web_app_switch_inline_query';

/**
 * Inserts the bot's username and the specified inline query in the current chat's input field.
 * Query may be empty, in which case only the bot's username will be inserted. The client prompts
 * the user to choose a specific chat, then opens that chat and inserts the bot's username and
 * the specified inline query in the input field.
 * @param query - text which should be inserted in the input after the current bot name. Max
 * length is 256 symbols.
 * @param chatTypes - List of chat types which could be chosen to send the message. Could be an
 * empty list.
 * @since Mini Apps v6.7
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The application must be launched in the inline mode
 * @example
 * if (switchInlineQuery.isAvailable()) {
 *   switchInlineQuery('my query goes here', ['users']);
 * }
 */
export const switchInlineQuery = wrapSafe(
  'switchInlineQuery',
  (query: string, chatTypes?: SwitchInlineQueryChatType[]) => {
    postEvent(SWITCH_INLINE_QUERY_METHOD, {
      query: query,
      chat_types: chatTypes || [],
    });
  },
  {
    isSupported() {
      return $launchParams().tgWebAppBotInline
        ? undefined
        : 'The application must be launched in the inline mode';
    }
  }
);
