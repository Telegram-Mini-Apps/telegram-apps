import type { CreateParams } from './utils.js';

/**
 * Chat type which could be used when calling `web_app_switch_inline_query` method.
 */
export type SwitchInlineQueryChatType = 'users' | 'bots' | 'groups' | 'channels';

export interface Methods67 {
  /**
   * Inserts the bot's username and the specified inline query in the current chat's input field.
   * Query may be empty, in which case only the bot's username will be inserted. The client prompts
   * the user to choose a specific chat, then opens that chat and inserts the bot's username and
   * the specified inline query in the input field.
   * @since v6.7
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-switch-inline-query
   */
  web_app_switch_inline_query: CreateParams<{
    /**
     * Text which should be inserted in the input after the current bot name. Max length is
     * 256 symbols.
     */
    query: string;
    /**
     * List of chat types which could be chosen to send the message. Could be empty list.
     */
    chat_types: SwitchInlineQueryChatType[];
  }>;
}