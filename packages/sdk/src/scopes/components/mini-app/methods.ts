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
  type BackgroundColor,
} from '@telegram-apps/bridge';
import { isRGB } from '@telegram-apps/transformers';
import { isPageReload } from '@telegram-apps/navigation';
import { computed, type Computed } from '@telegram-apps/signals';

import { $version, postEvent } from '@/scopes/globals.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';
import { mount as tpMount } from '@/scopes/components/theme-params/methods.js';
import { subAndCall } from '@/utils/subAndCall.js';
import { withSupports } from '@/scopes/toolkit/withSupports.js';
import { withIsSupported } from '@/scopes/toolkit/withIsSupported.js';
import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import { createWithIsMounted } from '@/scopes/toolkit/createWithIsMounted.js';

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

type StorageValue = State;

const WEB_APP_SET_BACKGROUND_COLOR = 'web_app_set_background_color';
const WEB_APP_SET_BOTTOM_BAR_COLOR = 'web_app_set_bottom_bar_color';
const WEB_APP_SET_HEADER_COLOR = 'web_app_set_header_color';
const STORAGE_KEY = 'miniApp';

/**
 * True if the Mini App component is supported.
 */
export const isSupported = computed(() => {
  return ([
    WEB_APP_SET_BACKGROUND_COLOR,
    WEB_APP_SET_BOTTOM_BAR_COLOR,
    WEB_APP_SET_HEADER_COLOR,
  ] as const).some(method => supports(method, $version()));
});

const withComponentSupported = createWithIsSupported(isSupported);
const withIsMounted = createWithIsMounted(isMounted);

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
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const bindCssVars = withIsMounted((getCSSVarName?: GetCssVarNameFn): VoidFunction => {
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
});

/**
 * Closes the Mini App.
 * @param returnBack - Should the client return to the previous activity.
 */
export function close(returnBack?: boolean): void {
  postEvent('web_app_close', { return_back: returnBack });
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 *
 * Internally, the function mounts the Theme Params component to work with correctly extracted
 * theme palette values.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const mount = withComponentSupported((): void => {
  if (!isMounted()) {
    const s = isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY);
    tpMount();

    backgroundColor.set(s ? s.backgroundColor : 'bg_color');
    bottomBarColor.set(s ? s.bottomBarColor : 'bottom_bar_bg_color');
    headerColor.set(s ? s.headerColor : 'bg_color');

    setBackgroundColor.isSupported() && subAndCall(backgroundColor, onBgColorChanged);
    setBottomBarColor.isSupported() && subAndCall(bottomBarColor, onBottomBarBgColorChanged);
    setHeaderColor.isSupported() && subAndCall(headerColor, onHeaderColorChanged);

    isMounted.set(true);
  }
});

function onBgColorChanged(): void {
  saveState();
  postEvent(WEB_APP_SET_BACKGROUND_COLOR, { color: backgroundColor() });
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
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const setBackgroundColor = withIsSupported(
  withIsMounted((color: BackgroundColor): void => {
    backgroundColor.set(color);
  }),
  WEB_APP_SET_BACKGROUND_COLOR,
);

/**
 * Updates the bottom bar background color.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const setBottomBarColor = withIsSupported(
  withIsMounted((color: BottomBarColor) => {
    bottomBarColor.set(color);
  }),
  WEB_APP_SET_BOTTOM_BAR_COLOR,
);

/**
 * Updates the header color.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const setHeaderColor = withSupports(
  withIsSupported(
    withIsMounted((color: HeaderColor): void => {
      headerColor.set(color);
    }),
    WEB_APP_SET_HEADER_COLOR,
  ),
  {
    color: [WEB_APP_SET_HEADER_COLOR, 'color', isRGB],
  },
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
