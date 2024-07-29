import { supports } from '@/bridge/supports.js';
import { createError } from '@/errors/createError.js';
import { ERR_INVALID_HOSTNAME } from '@/errors/errors.js';
import { version, postEvent, createRequestId } from '@/components/globals.js';
import { request } from '@/bridge/request.js';
import { decorateWithSupports } from '@/components/decorateWithSupports.js';
import { captureSameReq } from '@/bridge/captureSameReq.js';
import { createSafeURL } from '@/navigation/createSafeURL.js';

/*
 * fixme
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/utils
 * todo: usage
 */

export interface OpenLinkOptions {
  /**
   * Attempts to use the instant view mode.
   */
  tryInstantView?: boolean;
  /**
   * Attempts to use user preferred browser.
   */
  tryBrowser?: boolean;
}

const OPEN_TG_LINK_METHOD = 'web_app_open_tg_link';
const READ_TEXT_FROM_CLIPBOARD_METHOD = 'web_app_read_text_from_clipboard';

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
  const formattedUrl = createSafeURL(url).toString();

  // If the method is not supported, we are doing it in legacy way.
  if (!supports('web_app_open_link', version())) {
    window.open(formattedUrl, '_blank');
    return;
  }

  options ||= {};

  // Otherwise, do it normally.
  postEvent()('web_app_open_link', {
    url: formattedUrl,
    try_browser: options.tryBrowser,
    try_instant_view: options.tryInstantView,
  });
}

/**
 * Opens a Telegram link inside Telegram app. The Mini App will be closed. It expects passing
 * links in full format, with hostname "t.me".
 * @param url - URL to be opened.
 * @throws {SDKError} ERR_INVALID_HOSTNAME
 * @see ERR_INVALID_HOSTNAME
 */
export const openTelegramLink = decorateWithSupports((url: string): void => {
  const { hostname, pathname, search } = new URL(url, 'https://t.me');
  if (hostname !== 't.me') {
    throw createError(ERR_INVALID_HOSTNAME);
  }

  if (!supports(OPEN_TG_LINK_METHOD, version())) {
    window.location.href = url;
    return;
  }

  postEvent()(OPEN_TG_LINK_METHOD, { path_full: pathname + search });
}, OPEN_TG_LINK_METHOD);

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
 * Shares specified URL with the passed to the chats, selected by user. After being called,
 * it closes the mini application.
 *
 * This method uses Telegram's Share Links.
 * @param url - URL to share.
 * @param text - text to append after the URL.
 * @see https://core.telegram.org/api/links#share-links
 * @see https://core.telegram.org/widgets/share#custom-buttons
 */
export const shareURL = decorateWithSupports((url: string, text?: string): void => {
  openTelegramLink(
    `https://t.me/share/url?` + new URLSearchParams({ url, text: text || '' })
      .toString()
      // By default, URL search params encode spaces with "+".
      // We are replacing them with "%20", because plus symbols are working incorrectly
      // in Telegram.
      .replace(/\+/g, '%20'),
  );
}, OPEN_TG_LINK_METHOD);
