import { supports, TypedError, type OpenLinkBrowser } from '@telegram-apps/bridge';
import { createSafeURL } from '@telegram-apps/navigation';

import { $version, postEvent } from '@/scopes/globals.js';
import { ERR_INVALID_HOSTNAME } from '@/errors.js';

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

/**
 * Opens a link.
 *
 * The Mini App will not be closed.
 *
 * Note that this method can be called only in response to the user
 * interaction with the Mini App interface (e.g. click inside the Mini App or on the main button).
 * @param url - URL to be opened.
 * @param options - additional options.
 */
export function openLink(url: string, options?: OpenLinkOptions): void {
  options ||= {};
  postEvent('web_app_open_link', {
    url: createSafeURL(url).toString(),
    try_browser: options.tryBrowser,
    try_instant_view: options.tryInstantView,
  });
}

/**
 * Opens a Telegram link inside Telegram app. The Mini App will be closed. It expects passing
 * links in full format, with hostname "t.me".
 * @param url - URL to be opened.
 * @throws {TypedError} ERR_INVALID_HOSTNAME
 */
export function openTelegramLink(url: string): void {
  const { hostname, pathname, search } = new URL(url, 'https://t.me');
  if (hostname !== 't.me') {
    throw new TypedError(ERR_INVALID_HOSTNAME);
  }

  if (!supports(OPEN_TG_LINK_METHOD, $version())) {
    window.location.href = url;
    return;
  }

  postEvent(OPEN_TG_LINK_METHOD, { path_full: pathname + search });
}

/**
 * Shares specified URL with the passed to the chats, selected by user. After being called,
 * it closes the mini application.
 *
 * This method uses Telegram's Share Links.
 * @param url - URL to share.
 * @param text - text to append after the URL.
 * @see https://core.telegram.org/api/links#share-links
 * @see https://core.telegram.org/widgets/share#custom-buttons
 */
export function shareURL(url: string, text?: string): void {
  openTelegramLink(
    `https://t.me/share/url?` + new URLSearchParams({ url, text: text || '' })
      .toString()
      // By default, URL search params encode spaces with "+".
      // We are replacing them with "%20", because plus symbols are working incorrectly
      // in Telegram.
      .replace(/\+/g, '%20'),
  );
}
