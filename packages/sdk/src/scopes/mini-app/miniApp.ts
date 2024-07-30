import { postEvent } from '@/scopes/globals/globals.js';
import { isRGB } from '@/colors/isRGB.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import * as themeParams from '@/scopes/theme-params/themeParams.js';
import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { ERR_DATA_INVALID_SIZE } from '@/errors/errors.js';
import { createError } from '@/errors/createError.js';
import type { RGB } from '@/colors/types.js';

import * as _ from './miniApp.private.js';
import type { HeaderColor } from './types.js';
import { decorateWithSupports, WithSupports } from '@/scopes/decorateWithSupports.js';

// fixme: rgb color key check

const SET_BG_COLOR_METHOD = 'web_app_set_background_color';
const SET_HEADER_COLOR_METHOD = 'web_app_set_header_color';
const STORAGE_KEY = 'miniApp';

/**
 * Closes the Mini App.
 * @param returnBack - Should the client return to the previous activity.
 */
function close(returnBack?: boolean): void {
  postEvent()('web_app_close', { return_back: returnBack });
}

/**
 * Mounts the component.
 */
function mount(): void {
  if (!_.isMounted()) {
    const s = isPageReload() && getStorageValue(STORAGE_KEY);
    themeParams.mount();
    _.backgroundColor.set(s ? s.backgroundColor : themeParams.backgroundColor() || '#000000');
    _.backgroundColor.sub(onBgColorChanged);
    _.headerColor.set(s ? s.headerColor : themeParams.headerBackgroundColor() || 'bg_color');
    _.headerColor.sub(onHeaderColorChanged);
    _.isMounted.set(true);
  }
}

function onHeaderColorChanged(color: HeaderColor): void {
  saveState();
  postEvent()(SET_HEADER_COLOR_METHOD, isRGB(color) ? { color } : { color_key: color });
}

function onBgColorChanged(color: RGB): void {
  saveState();
  postEvent()(SET_BG_COLOR_METHOD, { color });
}

/**
 * Informs the Telegram app that the Mini App is ready to be displayed.
 *
 * It is recommended to call this method as early as possible, as soon as all essential
 * interface elements loaded.
 *
 * Once this method is called, the loading placeholder is hidden and the Mini App shown.
 *
 * If the method is not called, the placeholder will be hidden only when the page was fully loaded.
 */
function ready(): void {
  postEvent()('web_app_ready');
}

function saveState() {
  setStorageValue(STORAGE_KEY, {
    backgroundColor: _.backgroundColor(),
    headerColor: _.headerColor(),
  });
}

/**
 * A method used to send data to the bot.
 *
 * When this method called, a service message sent to the bot containing the data of the length
 * up to 4096 bytes, and the Mini App closed.
 *
 * See the field `web_app_data` in the class [Message](https://core.telegram.org/bots/api#message).
 *
 * This method is only available for Mini Apps launched via a Keyboard button.
 * @param data - data to send to bot.
 * @throws {SDKError} ERR_DATA_INVALID_SIZE
 * @see ERR_DATA_INVALID_SIZE
 */
function sendData(data: string): void {
  const { size } = new Blob([data]);
  if (!size || size > 4096) {
    throw createError(ERR_DATA_INVALID_SIZE);
  }
  postEvent()('web_app_data_send', { data });
}

/**
 * Updates the background color.
 */
const setBackgroundColor: WithIsSupported<(color: RGB) => void> = decorateWithIsSupported(color => {
  _.backgroundColor.set(color);
}, SET_BG_COLOR_METHOD);

/**
 * Updates the header color.
 */
const setHeaderColor: WithSupports<
  WithIsSupported<(color: HeaderColor) => void>,
  { color: ['web_app_set_header_color', 'color'] }
> = decorateWithSupports(
  decorateWithIsSupported(color => {
    _.headerColor.set(color);
  }, SET_HEADER_COLOR_METHOD),
  { color: [SET_HEADER_COLOR_METHOD, 'color'] },
);

/**
 * Unmounts the component.
 */
function unmount(): void {
  _.backgroundColor.unsub(onBgColorChanged);
  _.headerColor.unsub(onHeaderColorChanged);
  _.isMounted.set(false);
}

export {
  close,
  mount,
  unmount,
  ready,
  sendData,
  setHeaderColor,
  setBackgroundColor,
};

export * from './miniApp.computed.js';