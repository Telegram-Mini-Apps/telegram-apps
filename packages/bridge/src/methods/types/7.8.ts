import type { CreateParams } from './utils.js';

export interface Methods78 {
  /**
   * A method that opens the native story editor.
   * @since v7.8
   */
  web_app_share_to_story: CreateParams<{
    /**
     * A media URL which will be used as a background for a created story.
     */
    media_url: string;
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
    widget_link?: {
      /**
       * The URL to be included in the story.
       */
      url: string;
      /**
       * The name to be displayed for the widget link, 0-48 characters.
       */
      name?: string;
    }
  }>;
}