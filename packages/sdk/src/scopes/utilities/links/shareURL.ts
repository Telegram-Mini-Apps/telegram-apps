import { createWrapBasic } from '@/scopes/wrappers/createWrapBasic.js';
import { openTelegramLink } from '@/scopes/utilities/links/openTelegramLink.js';

const wrapBasic = createWrapBasic();

/**
 * Shares the specified URL with the passed to the chats, selected by user.
 * After being called, it closes the mini application.
 *
 * This method uses Telegram's Share Links.
 * @param url - URL to share.
 * @param text - text to append after the URL.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {InvalidArgumentsError} Invalid URL passed
 * @see https://core.telegram.org/api/links#share-links
 * @see https://core.telegram.org/widgets/share#custom-buttons
 */
export const shareURL = wrapBasic(
  'shareURL',
  (url: string, text?: string): void => {
    openTelegramLink(
      `https://t.me/share/url?` + new URLSearchParams({ url, text: text || '' })
        .toString()
        // By default, URL search params encode spaces with "+".
        // We are replacing them with "%20", because plus symbols are working incorrectly
        // in Telegram.
        .replace(/\+/g, '%20'),
    );
  },
);
