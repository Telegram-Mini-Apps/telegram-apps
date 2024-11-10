import { type OpenLinkBrowser, TypedError } from '@telegram-apps/bridge';

import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';
import { ERR_INVALID_URL } from '@/errors.js';
import { postEvent } from '@/scopes/globals.js';

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