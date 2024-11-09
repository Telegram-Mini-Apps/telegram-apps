import {
  getStorageValue,
  setStorageValue,
  createCbCollector,
  camelToKebab,
  deleteCssVar,
  setCssVar,
  supports,
  type RGB,
  type BottomBarColor,
  type BackgroundColor, MethodName,
} from '@telegram-apps/bridge';
import { isRGB } from '@telegram-apps/transformers';
import { isPageReload } from '@telegram-apps/navigation';
import { computed, type Computed } from '@telegram-apps/signals';

import { $version, postEvent } from '@/scopes/globals.js';
import { mount as tpMount } from '@/scopes/components/theme-params/methods.js';
import { throwCssVarsBound } from '@/scopes/toolkit/throwCssVarsBound.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';
import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';

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

const SET_BG_COLOR_METHOD = 'web_app_set_background_color';
const SET_BOTTOM_BAR_COLOR_METHOD = 'web_app_set_bottom_bar_color';
const SET_HEADER_COLOR_METHOD = 'web_app_set_header_color';
const COMPONENT_NAME = 'miniApp';

const isSupportedSchema = {
  any: [
    SET_BG_COLOR_METHOD,
    SET_BOTTOM_BAR_COLOR_METHOD,
    SET_HEADER_COLOR_METHOD,
  ] as MethodName[],
};

/**
 * True if the Mini App component is supported.
 */
export const isSupported = computed(() => {
  return isSupportedSchema.any.some(method => supports(method, $version()));
});

const wrapBasic = createWrapBasic(COMPONENT_NAME);
const wrapSupported = createWrapSupported(COMPONENT_NAME, isSupportedSchema);
const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, isSupportedSchema);

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
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_VARS_ALREADY_BOUND
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example Using no arguments
 * if (bindCssVars.isAvailable()) {
 *   bindCssVars();
 * }
 * @example Using custom CSS vars generator
 * if (bindCssVars.isAvailable()) {
 *   bindCssVars(key => `--my-prefix-${key}`);
 * }
 */
export const bindCssVars = wrapComplete(
  'bindCssVars',
  (getCSSVarName?: GetCssVarNameFn): VoidFunction => {
    isCssVarsBound() && throwCssVarsBound();

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
  },
);

/**
 * Closes the Mini App.
 * @param returnBack - should the client return to the previous activity.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example
 * if (close.isAvailable()) {
 *   close();
 * }
 */
export const close = wrapBasic('close', (returnBack?: boolean): void => {
  postEvent('web_app_close', { return_back: returnBack });
});

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 *
 * Internally, the function mounts the Theme Params component to work with correctly extracted
 * theme palette values.
 * @since Mini Apps v6.1
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapSupported(
  'mount',
  (): void => {
    if (!isMounted()) {
      const s = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
      tpMount();

      setBackgroundColor.ifAvailable(s ? s.backgroundColor : 'bg_color');
      setBottomBarColor.ifAvailable(s ? s.bottomBarColor : 'bottom_bar_bg_color');
      setHeaderColor.ifAvailable(s ? s.headerColor : 'bg_color');

      isMounted.set(true);
    }
  },
);

/**
 * Informs the Telegram app that the Mini App is ready to be displayed.
 *
 * It is recommended to call this method as early as possible, as soon as all
 * essential interface elements loaded.
 *
 * Once this method is called, the loading placeholder is hidden and the Mini
 * App shown.
 *
 * If the method is not called, the placeholder will be hidden only when the
 * page was fully loaded.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example
 * if (ready.isAvailable()) {
 *   ready();
 * }
 */
export const ready = wrapBasic('ready', (): void => {
  postEvent('web_app_ready');
});

function saveState() {
  setStorageValue<StorageValue>(COMPONENT_NAME, state());
}

/**
 * Updates the background color.
 * @since Mini Apps v6.1
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (setBackgroundColor.isAvailable()) {
 *   setBackgroundColor('bg_color');
 * }
 */
export const setBackgroundColor = wrapComplete(
  'setBackgroundColor',
  (color: BackgroundColor): void => {
    if (color !== backgroundColor()) {
      postEvent(SET_BG_COLOR_METHOD, { color });
      backgroundColor.set(color);
      saveState();
    }
  },
  SET_BG_COLOR_METHOD,
);

/**
 * Updates the bottom bar background color.
 * @since Mini Apps v7.10
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (setBottomBarColor.isAvailable()) {
 *   setBottomBarColor('ff11a3');
 * }
 */
export const setBottomBarColor = wrapComplete(
  'setBottomBarColor',
  (color: BottomBarColor) => {
    if (color !== bottomBarColor()) {
      postEvent(SET_BOTTOM_BAR_COLOR_METHOD, { color });
      bottomBarColor.set(color);
      saveState();
    }
  },
  SET_BOTTOM_BAR_COLOR_METHOD,
);

/**
 * Updates the header color.
 * @since Mini Apps v6.1
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example Using known color key
 * if (setHeaderColor.isAvailable()) {
 *   setHeaderColor('bg_color');
 * }
 * @example Using RGB
 * if (setHeaderColor.isAvailable() && setHeaderColor.supports.rgb()) {
 *   setHeaderColor('#ffaabb');
 * }
 */
export const setHeaderColor = wrapComplete(
  'setHeaderColor',
  (color: HeaderColor): void => {
    if (color !== headerColor()) {
      postEvent(SET_HEADER_COLOR_METHOD, isRGB(color) ? { color } : { color_key: color });
      headerColor.set(color);
      saveState();
    }
  },
  SET_HEADER_COLOR_METHOD,
  {
    rgb: [SET_HEADER_COLOR_METHOD, 'color', isRGB],
  },
);

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  isMounted.set(false);
}
