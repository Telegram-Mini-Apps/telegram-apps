import {
  getStorageValue,
  setStorageValue,
  createCbCollector,
  camelToKebab,
  deleteCssVar,
  setCssVar,
  TypedError,
  supports,
  type RGB,
} from '@telegram-apps/bridge';
import { isRGB } from '@telegram-apps/transformers';
import { isPageReload } from '@telegram-apps/navigation';

import { $version, postEvent } from '@/scopes/globals/globals.js';
import { withSupports } from '@/scopes/withSupports.js';
import { ERR_CSS_VARS_BOUND } from '@/errors.js';
import {
  mount as tpMount,
  state as tpState,
  backgroundColor as tpBackgroundColor,
  headerBackgroundColor as tpHeaderBackgroundColor,
} from '@/scopes/theme-params/instance.js';

import {
  headerColor,
  backgroundColor,
  isCssVarsBound,
  state,
  isMounted,
} from './signals.js';
import type { GetCssVarNameFn, HeaderColor, State } from './types.js';

type StorageValue = State;

const SET_BG_COLOR_METHOD = 'web_app_set_background_color';
const SET_HEADER_COLOR_METHOD = 'web_app_set_header_color';
const STORAGE_KEY = 'miniApp';

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
 * @throws {TypedError} ERR_CSS_VARS_BOUND
 */
export function bindCssVars(getCSSVarName?: GetCssVarNameFn): VoidFunction {
  if (isCssVarsBound()) {
    throw new TypedError(ERR_CSS_VARS_BOUND);
  }
  getCSSVarName ||= (prop) => `--tg-${camelToKebab(prop)}`;
  const bgVar = getCSSVarName('bgColor');
  const headerVar = getCSSVarName('headerColor');

  function updateHeaderColor() {
    const tp = tpState();

    const h = headerColor();
    if (isRGB(h)) {
      return setCssVar(headerVar, h);
    }

    const { secondaryBgColor, bgColor } = tp;
    if (h === 'bg_color' && bgColor) {
      return setCssVar(headerVar, bgColor);
    }
    if (h === 'secondary_bg_color' && secondaryBgColor) {
      setCssVar(headerVar, secondaryBgColor);
    }
  }

  function updateBgColor() {
    setCssVar(bgVar, backgroundColor());
  }

  updateBgColor();
  updateHeaderColor();

  const [, cleanup] = createCbCollector(
    backgroundColor.sub(updateBgColor),
    [headerColor, tpState].map(s => s.sub(updateHeaderColor)),
  );
  isCssVarsBound.set(true);

  return () => {
    [headerVar, bgVar].forEach(deleteCssVar);
    cleanup();
    isCssVarsBound.set(false);
  };
}

/**
 * Closes the Mini App.
 * @param returnBack - Should the client return to the previous activity.
 */
export function close(returnBack?: boolean): void {
  postEvent('web_app_close', { return_back: returnBack });
}

/**
 * @returns True if the back button is supported.
 */
export function isSupported(): boolean {
  return supports(SET_BG_COLOR_METHOD, $version());
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    const s = isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY);
    tpMount();
    backgroundColor.set(s ? s.backgroundColor : tpBackgroundColor() || '#000000');
    backgroundColor.sub(onBgColorChanged);
    headerColor.set(s ? s.headerColor : tpHeaderBackgroundColor() || 'bg_color');
    headerColor.sub(onHeaderColorChanged);
    isMounted.set(true);
  }
}

function onHeaderColorChanged(color: HeaderColor): void {
  saveState();
  postEvent(SET_HEADER_COLOR_METHOD, isRGB(color) ? { color } : { color_key: color });
}

function onBgColorChanged(color: RGB): void {
  saveState();
  postEvent(SET_BG_COLOR_METHOD, { color });
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
  postEvent('web_app_ready');
}

function saveState() {
  setStorageValue<StorageValue>(STORAGE_KEY, state());
}

/**
 * Updates the background color.
 */
export function setBackgroundColor(color: RGB): void {
  backgroundColor.set(color);
}

/**
 * Updates the header color.
 */
export const setHeaderColor = withSupports(
  (color: HeaderColor): void => {
    headerColor.set(color);
  },
  { color: [SET_HEADER_COLOR_METHOD, 'color'] },
);

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  backgroundColor.unsub(onBgColorChanged);
  headerColor.unsub(onHeaderColorChanged);
  isMounted.set(false);
}
