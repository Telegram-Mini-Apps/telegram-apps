import { isRGB } from '@telegram-apps/transform';
import { createCleanup, type RGB } from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { computed } from '@telegram-apps/signals';
import type { VoidFn } from '@telegram-apps/types';

import { $postEvent } from '@/scopes/globals/globals.js';
import { getStorageValue, setStorageValue } from '@/utils/storage.js';
import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { decorateWithSupports, type WithSupports } from '@/scopes/decorateWithSupports.js';
import { ERR_CSS_VARS_BOUND, ERR_DATA_INVALID_SIZE } from '@/errors/errors.js';
import { deleteCssVar, setCssVar } from '@/utils/css-vars.js';
import { camelToKebab } from '@/utils/casing.js';
import { createError } from '@/errors/createError.js';
import { isColorDark } from '@/utils/isColorDark.js';

import * as _themeParams from '@/scopes/theme-params/private.js';
import * as themeParams from '@/scopes/theme-params/index.js';

import * as _ from './private.js';
import type { GetCssVarNameFn, HeaderColor, State } from './types.js';

const SET_BG_COLOR_METHOD = 'web_app_set_background_color';
const SET_HEADER_COLOR_METHOD = 'web_app_set_header_color';
const STORAGE_KEY = 'miniApp';

/**
 * The Mini App background color.
 * @example "#ffaabb"
 */
export const backgroundColor = computed(_.backgroundColor);

/**
 * Creates CSS variables connected with the mini app.
 *
 * Default variables:
 * - `--tg-bg-color`
 * - `--tg-header-color`
 *
 * Variables are being automatically updated if theme parameters were changed.
 *
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * mini app key.
 * MiniApp property.
 * @returns Function to stop updating variables.
 */
export function bindCssVars(getCSSVarName?: GetCssVarNameFn): VoidFn {
  if (_.isCssVarsBound()) {
    throw createError(ERR_CSS_VARS_BOUND);
  }
  getCSSVarName ||= (prop) => `--tg-${camelToKebab(prop)}`;
  const bgVar = getCSSVarName('bgColor');
  const headerVar = getCSSVarName('headerColor');

  function actualize() {
    setCssVar(bgVar, _.backgroundColor());

    const h = _.headerColor();
    if (isRGB(h)) {
      return setCssVar(headerVar, _.backgroundColor());
    }

    const bgColor = themeParams.backgroundColor();
    if (h === 'bg_color' && bgColor) {
      return setCssVar(bgVar, bgColor);
    }

    const secondaryBgColor = themeParams.secondaryBackgroundColor();
    if (h === 'secondary_bg_color' && secondaryBgColor) {
      setCssVar(bgVar, secondaryBgColor);
    }
  }

  actualize();
  const [, cleanup] = createCleanup(
    [
      _.backgroundColor,
      _.headerColor,
      _themeParams.state,
    ].map(s => s.sub(actualize)),
  );
  _.isCssVarsBound.set(true);

  return () => {
    [headerVar, bgVar].forEach(deleteCssVar);
    cleanup();
    _.isCssVarsBound.set(false);
  };
}

/**
 * Closes the Mini App.
 * @param returnBack - Should the client return to the previous activity.
 */
export function close(returnBack?: boolean): void {
  $postEvent()('web_app_close', { return_back: returnBack });
}

/**
 * The Mini App header color.
 * @example "#ffaabb"
 * @example "bg_color"
 */
export const headerColor = computed(_.headerColor);

/**
 * True if the current Mini App background color is recognized as dark.
 */
export const isDark = computed(() => isColorDark(_.backgroundColor()));

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = computed(_.isCssVarsBound);

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
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
  $postEvent()(SET_HEADER_COLOR_METHOD, isRGB(color) ? { color } : { color_key: color });
}

function onBgColorChanged(color: RGB): void {
  saveState();
  $postEvent()(SET_BG_COLOR_METHOD, { color });
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
export function ready(): void {
  $postEvent()('web_app_ready');
}

function saveState() {
  setStorageValue(STORAGE_KEY, state());
}

/**
 * Complete component state.
 */
export const state = computed<State>(() => ({
  backgroundColor: _.backgroundColor(),
  headerColor: _.headerColor(),
}));

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
export function sendData(data: string): void {
  const { size } = new Blob([data]);
  if (!size || size > 4096) {
    throw createError(ERR_DATA_INVALID_SIZE);
  }
  $postEvent()('web_app_data_send', { data });
}

/**
 * Updates the background color.
 */
export const setBackgroundColor: WithIsSupported<(color: RGB) => void> = decorateWithIsSupported(color => {
  _.backgroundColor.set(color);
}, SET_BG_COLOR_METHOD);

/**
 * Updates the header color.
 */
export const setHeaderColor: WithSupports<
  WithIsSupported<(color: HeaderColor) => void>,
  { color: ['web_app_set_header_color', 'color'] }
> = decorateWithSupports(
  decorateWithIsSupported(color => {
    _.headerColor.set(color);
  }, SET_HEADER_COLOR_METHOD),
  { color: [SET_HEADER_COLOR_METHOD, 'color'] },
);

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  _.backgroundColor.unsub(onBgColorChanged);
  _.headerColor.unsub(onHeaderColorChanged);
  _.isMounted.set(false);
}
