import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { postEvent } from '@/scopes/globals.js';

const SHARE_STORY_METHOD = 'web_app_share_to_story';

export interface ShareStoryOptions {
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
 * Opens the native story editor.
 * @since Mini Apps v7.8
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example
 * if (shareStory.isAvailable()) {
 *   shareStory('https://example.com/background.png', {
 *     text: 'Look at this cool group!',
 *     widgetLink: {
 *       url: 'https://t.me/heyqbnk',
 *       name: 'Vlad\'s community',
 *     },
 *   });
 * }
 */
export const shareStory = wrapSafe(
  'shareStory',
  (mediaUrl: string, options?: ShareStoryOptions) => {
    options ||= {};
    postEvent(SHARE_STORY_METHOD, {
      text: options.text,
      media_url: mediaUrl,
      widget_link: options.widgetLink,
    });
  },
  { isSupported: SHARE_STORY_METHOD },
);