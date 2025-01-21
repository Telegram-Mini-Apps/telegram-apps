import { supports } from '@telegram-apps/bridge';

import { createWrapBasic } from '@/scopes/wrappers/createWrapBasic.js';
import { InvalidArgumentsError } from '@/errors.js';
import { version, postEvent } from '@/globals.js';

const OPEN_TG_LINK_METHOD = 'web_app_open_tg_link';
const wrapBasic = createWrapBasic();

/**
 * Opens a Telegram link inside the Telegram app. The function expects passing a link in a full
 * format using the hostname "t.me".
 *
 * The Mini App will be closed.
 * @param url - URL to be opened.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {InvalidArgumentsError} Invalid URL passed
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
      throw new InvalidArgumentsError(`"${urlString}" is invalid URL`);
    }

    if (!supports(OPEN_TG_LINK_METHOD, version())) {
      window.location.href = urlString;
      return;
    }

    url = new URL(url);
    postEvent(OPEN_TG_LINK_METHOD, { path_full: url.pathname + url.search });
  },
);