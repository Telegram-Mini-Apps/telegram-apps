import {
  off,
  on,
  retrieveLaunchParams,
  camelToKebab,
  createCbCollector,
  getStorageValue,
  setStorageValue,
  deleteCssVar,
  setCssVar,
  supports,
  type EventListener,
  type MethodName,
} from '@telegram-apps/bridge';
import {isPageReload} from '@telegram-apps/navigation';
import {computed, type Signal} from '@telegram-apps/signals';

import {$version, postEvent} from '@/scopes/globals.js';
import {mount as tpMount} from '@/scopes/components/theme-params/methods.js';
import {throwCssVarsBound} from '@/scopes/toolkit/throwCssVarsBound.js';
import {createWrapComplete} from '@/scopes/toolkit/createWrapComplete.js';
import {createWrapSupported} from '@/scopes/toolkit/createWrapSupported.js';

import {
  isCssVarsBound,
  state,
  isMounted,
  safeAreaInset,
  contentSafeAreaInset,
} from './signals.js';
import {GetCSSVarNameFn} from './types.js';
import {SafeAreaInset} from "@telegram-apps/bridge";

type StorageValue = SafeAreaInset;

const REQUEST_METHOD = 'web_app_request_safe_area';
const REQUEST_CONTENT_METHOD = 'web_app_request_content_safe_area';
const CHANGED_EVENT = 'safe_area_changed';
const CONTENT_CHANGED_EVENT = 'content_safe_area_changed';
const COMPONENT_NAME = 'safeArea';

const isSupportedSchema = {
  any: [
    REQUEST_METHOD,
    REQUEST_CONTENT_METHOD,
  ] as MethodName[],
};

/**
 * True if the Mini App component is supported.
 */
export const isSupported = computed(() => {
  return isSupportedSchema.any.some(method => supports(method, $version()));
});

const wrapSupported = createWrapSupported(COMPONENT_NAME, isSupportedSchema);
const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, isSupportedSchema);

/**
 * Creates CSS variables connected with the mini app.
 *
 * Default variables:
 * - `--tg-safe-area-inset-top`
 * - `--tg-safe-area-inset-bottom`
 * - `--tg-safe-area-inset-left`
 * - `--tg-safe-area-inset-right`

 * - `--tg-content-safe-area-inset-top`
 * - `--tg-content-safe-area-inset-bottom`
 * - `--tg-content-safe-area-inset-left`
 * - `--tg-content-safe-area-inset-right`
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
  (getCSSVarName?: GetCSSVarNameFn): VoidFunction => {
    isCssVarsBound() && throwCssVarsBound();

    type Component = "safeArea" | "contentSafeArea";
    const props = ['top', 'bottom', 'left', 'right'] as const;

    const getCompCSSVarName = (component: Component) =>
      getCSSVarName ||= (prop) => `--tg-${camelToKebab(component)}-${camelToKebab(prop)}`;

    function actualize(component: Component): void {
      const fn = component === "safeArea" ? safeAreaInset : contentSafeAreaInset;
      props.forEach(prop => {
        setCssVar(getCompCSSVarName(component)(prop), `${fn()[prop]}px`);
      });
    }

    const actualizeSA = () => actualize("safeArea");
    const actualizeCSA = () => actualize("contentSafeArea");

    actualizeSA();
    actualizeCSA();
    state.sub(actualizeSA);
    state.sub(actualizeCSA);
    isCssVarsBound.set(true);

    return () => {
      props.forEach(deleteCssVar);
      state.unsub(actualizeSA);
      state.unsub(actualizeCSA);
      isCssVarsBound.set(false);
    };
  },
);

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 *
 * Internally, the function mounts the Theme Params component to work with correctly extracted
 * theme palette values.
 * @since Mini Apps v8.0
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
      isMounted.set(true);
    }
  },
);

const onSafeAreaChanged: EventListener<'safe_area_changed'> = (data) => {
  setState(
    'safeAreaInset',
    safeAreaInset,
    {
      top: data.safeAreaInset.top,
      bottom: data.safeAreaInset.bottom,
      left: data.safeAreaInset.left,
      right: data.safeAreaInset.right,
    });
};

const onContentSafeAreaChanged: EventListener<'content_safe_area_changed'> = (data) => {
  setState(
    'contentSafeAreaInset',
    contentSafeAreaInset,
    {
      top: data.contentSafeAreaInset.top,
      bottom: data.contentSafeAreaInset.bottom,
      left: data.contentSafeAreaInset.left,
      right: data.contentSafeAreaInset.right,
    });
};

function setState(fnName: string, fn: Signal<SafeAreaInset>, s: SafeAreaInset) {
  fn.set({
    top: truncate(s.top),
    bottom: truncate(s.bottom),
    left: truncate(s.left),
    right: truncate(s.right),
  });
  setStorageValue<StorageValue>(fnName, fn());
}

/**
 * Formats value to make it stay in bounds [0, +Inf).
 * @param value - value to format.
 */
function truncate(value: number): number {
  return Math.max(value, 0);
}

/**
 * Unmounts the component, removing the listeners, saving the component state in the local storage.
 */
export function unmount(): void {
  off('safe_area_changed', onSafeAreaChanged);
  off('content_safe_area_changed', onContentSafeAreaChanged);
  isMounted.set(false);
}
