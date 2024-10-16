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
  type BottomBarColor,
} from '@telegram-apps/bridge';
import { isRGB } from '@telegram-apps/transformers';
import { isPageReload } from '@telegram-apps/navigation';
import type { Computed } from '@telegram-apps/signals';

import { $version, postEvent } from '@/scopes/globals.js';
import { withIsSupported } from '@/scopes/withIsSupported.js';
import { withSupports } from '@/scopes/withSupports.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';
import { mount as tpMount } from '@/scopes/components/theme-params/methods.js';
import {
  headerBackgroundColor as tpHeaderBackgroundColor,
} from '@/scopes/components/theme-params/signals.js';

import {
  headerColor,
  backgroundColor,
  isCssVarsBound,
  state,
  isMounted,
  bottomBarColor,
  headerColorRGB,
  bottomBarColorRGB,
  backgroundColorRGB,
} from './signals.js';
import type { GetCssVarNameFn, HeaderColor, State } from './types.js';
import { subAndCall } from '@/utils/subAndCall.js';

type StorageValue = State;

const WEB_APP_SET_BACKGROUND_COLOR = 'web_app_set_background_color';
const WEB_APP_SET_BOTTOM_BAR_COLOR = 'web_app_set_bottom_bar_color';
const WEB_APP_SET_HEADER_COLOR = 'web_app_set_header_color';
const STORAGE_KEY = 'miniApp';

/**
 * Creates CSS variables connected with the mini app.
 *
 * Default variables:
 * - `--tg-bg-color`
 * - `--tg-header-color`
 * - `--tg-bottom-bar-color`
 *
 * Variables are being automatically updated if theme parameters were changed.
 *
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * mini app key.
 * @returns Function to stop updating variables.
 * @throws {TypedError} ERR_ALREADY_CALLED
 */
export function bindCssVars(getCSSVarName?: GetCssVarNameFn): VoidFunction {
  if (isCssVarsBound()) {
    throw new TypedError(ERR_ALREADY_CALLED);
  }
  const [addCleanup, cleanup] = createCbCollector();

  /**
   * Binds specified CSS variable to a signal.
   * @param cssVar - CSS variable name.
   * @param signal - signal to listen changes to.
   */
  function bind(cssVar: string, signal: Computed<RGB | undefined>) {
    function update() {
      setCssVar(cssVar, signal() || null);
    }

    // Instantly set CSS variable.
    update();

    // Remember to clean this relation up.
    addCleanup(signal.sub(update), deleteCssVar.bind(null, cssVar));
  }

  getCSSVarName ||= (prop) => `--tg-${camelToKebab(prop)}`;
  bind(getCSSVarName('bgColor'), backgroundColorRGB);
  bind(getCSSVarName('bottomBarColor'), bottomBarColorRGB);
  bind(getCSSVarName('headerColor'), headerColorRGB);
  addCleanup(() => {
    isCssVarsBound.set(false);
  });

  isCssVarsBound.set(true);

  return cleanup;
}

/**
 * Closes the Mini App.
 * @param returnBack - Should the client return to the previous activity.
 */
export function close(returnBack?: boolean): void {
  postEvent('web_app_close', { return_back: returnBack });
}

/**
 * @returns True if the Mini App component is supported.
 */
export function isSupported(): boolean {
  return ([
    WEB_APP_SET_BACKGROUND_COLOR,
    WEB_APP_SET_BOTTOM_BAR_COLOR,
    WEB_APP_SET_HEADER_COLOR,
  ] as const).some(method => supports(method, $version()));
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 *
 * Internally, the function mounts the Theme Params component to work with correctly extracted
 * theme palette values.
 */
export function mount(): void {
  if (!isMounted()) {
    const s = isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY);
    tpMount();

    backgroundColor.set(s ? s.backgroundColor : 'bg_color');
    bottomBarColor.set(s ? s.bottomBarColor : 'bottom_bar_bg_color');
    headerColor.set(s ? s.headerColor : tpHeaderBackgroundColor() || 'bg_color');

    subAndCall(backgroundColor, onBgColorChanged);
    subAndCall(bottomBarColor, onBottomBarBgColorChanged);
    subAndCall(headerColor, onHeaderColorChanged);

    isMounted.set(true);
  }
}

function onBgColorChanged(): void {
  const color = backgroundColor();
  saveState();
  postEvent(WEB_APP_SET_BACKGROUND_COLOR, { color });
}

function onBottomBarBgColorChanged(): void {
  saveState();
  postEvent(WEB_APP_SET_BOTTOM_BAR_COLOR, { color: bottomBarColor() });
}

function onHeaderColorChanged(): void {
  const color = headerColor();
  saveState();
  postEvent(WEB_APP_SET_HEADER_COLOR, isRGB(color) ? { color } : { color_key: color });
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
export const setBackgroundColor = withIsSupported((color: RGB): void => {
  backgroundColor.set(color);
}, WEB_APP_SET_BACKGROUND_COLOR);

/**
 * Updates the bottom bar background color.
 */
export const setBottomBarColor = withIsSupported((color: BottomBarColor) => {
  bottomBarColor.set(color);
}, WEB_APP_SET_BOTTOM_BAR_COLOR);

/**
 * Updates the header color.
 */
export const setHeaderColor = withSupports(
  withIsSupported((color: HeaderColor): void => {
    headerColor.set(color);
  }, WEB_APP_SET_HEADER_COLOR),
  { color: [WEB_APP_SET_HEADER_COLOR, 'color'] },
);

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  backgroundColor.unsub(onBgColorChanged);
  bottomBarColor.unsub(onBottomBarBgColorChanged);
  headerColor.unsub(onHeaderColorChanged);
  isMounted.set(false);
}
