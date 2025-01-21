import type { OpenLinkBrowser } from '@telegram-apps/bridge';

import { createWrapBasic } from '@/scopes/wrappers/createWrapBasic.js';
import { InvalidArgumentsError } from '@/errors.js';
import { postEvent } from '@/globals.js';

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
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {InvalidArgumentsError} Invalid URL passed
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
        throw new InvalidArgumentsError(`"${url.toString()}" is invalid URL`, e);
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