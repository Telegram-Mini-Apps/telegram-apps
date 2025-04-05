import {
  supports,
  on,
  off,
  type EventListener,
  type BottomBarColor,
  type BackgroundColor,
  type MethodName,
} from '@telegram-apps/bridge';
import { isRGB } from '@telegram-apps/transformers';
import { isPageReload } from '@telegram-apps/navigation';
import { type Computed, batch } from '@telegram-apps/signals';
import {
  camelToKebab,
  createCbCollector,
  getStorageValue,
  setStorageValue,
} from '@telegram-apps/toolkit';
import { RGB } from '@telegram-apps/types';

import { version, postEvent } from '@/globals.js';
import { mount as mountThemeParams } from '@/scopes/components/theme-params/methods.js';
import { createWrapComplete } from '@/scopes/wrappers/createWrapComplete.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';
import { createWrapBasic } from '@/scopes/wrappers/createWrapBasic.js';
import { createComputed } from '@/signals-registry.js';
import { CSSVarsBoundError } from '@/errors.js';
import { deleteCssVar, setCssVar } from '@/utils/css-vars.js';
import { defineMountFn } from '@/scopes/defineMountFn.js';
import { signalCancel } from '@/scopes/signalCancel.js';
import { mountThemeParamsSync } from '@/scopes/components/theme-params/exports.js';
import type { RequestOptionsNoCapture } from '@/types.js';

import {
  _isCssVarsBound,
  state,
  headerColorRGB,
  bottomBarColorRGB,
  backgroundColorRGB,
  _isActive,
  _backgroundColor,
  _bottomBarColor,
  _headerColor,
} from './signals.js';
import type { GetCssVarNameFn, HeaderColor, State } from './types.js';

type StorageValue = State;

const SET_BG_COLOR_METHOD = 'web_app_set_background_color';
const SET_BOTTOM_BAR_COLOR_METHOD = 'web_app_set_bottom_bar_color';
const SET_HEADER_COLOR_METHOD = 'web_app_set_header_color';
const VISIBILITY_CHANGED_EVENT = 'visibility_changed';
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
export const isSupported = createComputed(() => {
  return isSupportedSchema.any.some(method => supports(method, version()));
});

const onVisibilityChanged: EventListener<'visibility_changed'> = (data) => {
  _isActive.set(data.is_visible);
  saveState();
};

const [
  mountFn,
  tMountPromise,
  tMountError,
  tIsMounted,
] = defineMountFn(
  COMPONENT_NAME,
  (options?: RequestOptionsNoCapture) => {
    return mountThemeParams(options).then(() => {
      return isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || undefined;
    });
  },
  s => {
    setBackgroundColor.ifAvailable(s ? s.backgroundColor : 'bg_color');
    setBottomBarColor.ifAvailable(s ? s.bottomBarColor : 'bottom_bar_bg_color');
    setHeaderColor.ifAvailable(s ? s.headerColor : 'bg_color');
    _isActive.set(s ? s.isActive : true);

    on(VISIBILITY_CHANGED_EVENT, onVisibilityChanged);
  },
);

const wrapBasic = createWrapBasic(COMPONENT_NAME);
const wrapSupported = createWrapSupported(COMPONENT_NAME, isSupportedSchema);
const wrapComplete = createWrapComplete(COMPONENT_NAME, tIsMounted[0], isSupportedSchema);

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
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {CSSVarsBoundError} CSS variables are already bound
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @throws {FunctionNotAvailableError} The SDK is not initialized
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
    if (_isCssVarsBound()) {
      throw new CSSVarsBoundError();
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
      _isCssVarsBound.set(false);
    });

    _isCssVarsBound.set(true);

    return cleanup;
  },
);

/**
 * Closes the Mini App.
 * @param returnBack - should the client return to the previous activity.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
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
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @deprecated Use `mountSync`.
 * @example
 * if (mount.isAvailable()) {
 *   await mount();
 * }
 */
export const mount = wrapSupported('mount', mountFn);
/**
 * @deprecated The initialization is synchronous. Use `mountSync`.
 */
export const isMounting = tMountPromise[2];
/**
 * @deprecated The initialization is synchronous. Use `mountSync`.
 */
export const mountPromise = tMountPromise[1];
/**
 * @deprecated The initialization is synchronous. Use `mountSync`.
 */
export const mountError = tMountError[1];

export const [_isMounted, isMounted] = tIsMounted;

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 *
 * Internally, the function mounts the Theme Params component to work with correctly extracted
 * theme palette values.
 * @since Mini Apps v6.1
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (mountSync.isAvailable()) {
 *   mountSync();
 * }
 */
export const mountSync = wrapSupported('mountSync', () => {
  if (!_isMounted()) {
    mountThemeParamsSync();
    const s = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || undefined;

    setBackgroundColor.ifAvailable(s ? s.backgroundColor : 'bg_color');
    setBottomBarColor.ifAvailable(s ? s.bottomBarColor : 'bottom_bar_bg_color');
    setHeaderColor.ifAvailable(s ? s.headerColor : 'bg_color');
    on(VISIBILITY_CHANGED_EVENT, onVisibilityChanged);

    batch(() => {
      _isActive.set(s ? s.isActive : true);
      _isMounted.set(true);
    });
  }
});

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
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
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
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @example
 * if (setBackgroundColor.isAvailable()) {
 *   setBackgroundColor('bg_color');
 * }
 */
export const setBackgroundColor = wrapComplete(
  'setBackgroundColor',
  (color: BackgroundColor): void => {
    if (color !== _backgroundColor()) {
      postEvent(SET_BG_COLOR_METHOD, { color });
      _backgroundColor.set(color);
      saveState();
    }
  },
  SET_BG_COLOR_METHOD,
);

/**
 * Updates the bottom bar background color.
 * @since Mini Apps v7.10
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @example
 * if (setBottomBarColor.isAvailable()) {
 *   setBottomBarColor('ff11a3');
 * }
 */
export const setBottomBarColor = wrapComplete(
  'setBottomBarColor',
  (color: BottomBarColor) => {
    if (color !== _bottomBarColor()) {
      postEvent(SET_BOTTOM_BAR_COLOR_METHOD, { color });
      _bottomBarColor.set(color);
      saveState();
    }
  },
  SET_BOTTOM_BAR_COLOR_METHOD,
);

/**
 * Updates the header color.
 * @since Mini Apps v6.1
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The parent component is not mounted
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
    if (color !== _headerColor()) {
      postEvent(SET_HEADER_COLOR_METHOD, isRGB(color) ? { color } : { color_key: color });
      _headerColor.set(color);
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
  signalCancel(mountPromise);
  off(VISIBILITY_CHANGED_EVENT, onVisibilityChanged);
  _isMounted.set(false);
}
