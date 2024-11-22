import {
  camelToKebab,
  deleteCssVar,
  getStorageValue,
  off,
  on,
  retrieveLaunchParams,
  setCssVar,
  setStorageValue,
  supports,
  type EventListener,
  type MethodName,
} from '@telegram-apps/bridge';
import {isPageReload} from '@telegram-apps/navigation';
import {computed, type Signal} from '@telegram-apps/signals';

import {$version} from '@/scopes/globals.js';
import {throwCssVarsBound} from '@/scopes/toolkit/throwCssVarsBound.js';
import {createWrapComplete} from '@/scopes/toolkit/createWrapComplete.js';
import {createWrapSupported} from '@/scopes/toolkit/createWrapSupported.js';

import {
  contentInset,
  isCssVarsBound,
  initialValue,
  inset,
  isMounted,
  state,
} from './signals.js';
import {GetCSSVarNameFn, State} from './types.js';
import {SafeAreaInset} from "@telegram-apps/bridge";
import {createMountFn} from "@/scopes/createMountFn.js";
import {isMounting, mountError} from "@/scopes/components/safe-area/signals.js";
import {requestInsets} from "@/scopes/components/safe-area/requestSafeArea.js";

type StorageValue = SafeAreaInset;

const REQUEST_METHOD = 'web_app_request_safe_area';
const REQUEST_CONTENT_METHOD = 'web_app_request_content_safe_area';
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
      const fn = component === "safeArea" ? inset : contentInset;
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
  createMountFn<State>(
    COMPONENT_NAME,
    options => {
      if (isMounted()) return state();

      // Try to restore the state using the storage.
      if (isPageReload()) {
        const insets = getStorageValue<StorageValue>('safeAreaInset');
        const contentInsets = getStorageValue<StorageValue>('contentSafeAreaInset');
        if (insets && contentInsets) {
          return {
            safeAreaInset: insets,
            contentSafeAreaInset: contentInsets
          };
        }
      }

      // If the platform has a stable viewport, it means we could use the window global object
      // properties.
      if ([
        'macos',
        'tdesktop',
        'unigram',
        'webk',
        'weba',
        'web',
      ].includes(retrieveLaunchParams().platform)) {
        return {
          safeAreaInset: initialValue,
          contentSafeAreaInset: initialValue
        };
      }

      // We were unable to retrieve data locally. In this case, we are sending
      // a request returning the viewport information.
      options.timeout ||= 1000;
      return requestInsets(options);
    },
    result => {
      on('safe_area_changed', onSafeAreaChanged);
      on('content_safe_area_changed', onContentSafeAreaChanged);
      setGlobalState(result);
    },
    {isMounted, isMounting, mountError},
  ),
);

const onSafeAreaChanged: EventListener<'safe_area_changed'> = (data) => {
  setSafeAreaState(data);
};

const onContentSafeAreaChanged: EventListener<'content_safe_area_changed'> = (data) => {
  setContentSafeAreaState(data);
};

function setSafeAreaState(safeArea: SafeAreaInset) {
  setState('safeAreaInset', inset, safeArea);
}

function setContentSafeAreaState(safeArea: SafeAreaInset) {
  setState('contentSafeAreaInset', contentInset, safeArea);
}

function setState(fnName: string, fn: Signal<SafeAreaInset>, s: SafeAreaInset) {
  fn.set({
    top: truncate(s.top),
    bottom: truncate(s.bottom),
    left: truncate(s.left),
    right: truncate(s.right),
  });
  setStorageValue<SafeAreaInset>(fnName, fn());
}

function setGlobalState(state: State) {
  setSafeAreaState(state.safeAreaInset);
  setSafeAreaState(state.contentSafeAreaInset);
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
