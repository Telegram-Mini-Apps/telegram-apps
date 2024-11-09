import {
  supports,
  TypedError,
  type OpenLinkBrowser,
} from '@telegram-apps/bridge';

import { $version, postEvent } from '@/scopes/globals.js';
import { ERR_INVALID_URL } from '@/errors.js';
import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';

export interface OpenLinkOptions {
  /**
   * Attempts to use the instant view mode.
   */
  tryInstantView?: boolean;
  /**
   * A preferred browser to open the link in.
   */
  tryBrowser?: OpenLinkBrowser;
}

const OPEN_TG_LINK_METHOD = 'web_app_open_tg_link';
const wrapBasic = createWrapBasic();

/**
 * Opens a link.
 *
 * The Mini App will not be closed.
 *
 * Note that this method can be called only in response to the user
 * interaction with the Mini App interface (e.g. click inside the Mini App or on the main button).
 * @param url - URL to be opened.
 * @param options - additional options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_INVALID_URL
 * @example
 * if (openLink.isAvailable()) {
 *   openLink('https://google.com', {
 *     tryInstantView: true,
 *     tryBrowser: 'chrome',
 *   });
 * }
 */
export const openLink = wrapBasic(
  'openLink',
  (url: string | URL, options?: OpenLinkOptions): void => {
    if (typeof url === 'string') {
      try {
        url = new URL(url);
      } catch (e) {
        throw new TypedError(ERR_INVALID_URL, `"${url.toString()}" is invalid URL`, e);
      }
    }
    options ||= {};
    postEvent('web_app_open_link', {
      url: url.toString(),
      try_browser: options.tryBrowser,
      try_instant_view: options.tryInstantView,
    });
  },
);

/**
 * Opens a Telegram link inside the Telegram app. The function expects passing
 * a link in a full format using the hostname "t.me".
 *
 * The Mini App will be closed.
 * @param url - URL to be opened.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_INVALID_URL
 * @example
 * if (openTelegramLink.isAvailable()) {
 *   openTelegramLink('https://t.me/heyqbnk');
 * }
 */
export const openTelegramLink = wrapBasic(
  'openTelegramLink',
  (url: string | URL): void => {
    const urlString = url.toString();
    if (!urlString.match(/^https:\/\/t.me\/.+/)) {
      throw new TypedError(ERR_INVALID_URL, `"${urlString}" is invalid URL`);
    }

    if (!supports(OPEN_TG_LINK_METHOD, $version())) {
      window.location.href = urlString;
      return;
    }

    url = new URL(url);
    postEvent(OPEN_TG_LINK_METHOD, { path_full: url.pathname + url.search });
  },
);

/**
 * Shares the specified URL with the passed to the chats, selected by user.
 * After being called, it closes the mini application.
 *
 * This method uses Telegram's Share Links.
 * @param url - URL to share.
 * @param text - text to append after the URL.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
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
