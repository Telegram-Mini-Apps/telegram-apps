import {
  off,
  on,
  retrieveLaunchParams,
  camelToKebab,
  getStorageValue,
  setStorageValue,
  deleteCssVar,
  setCssVar,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { postEvent } from '@/scopes/globals.js';
import { createMountFn } from '@/scopes/createMountFn.js';
import { createWrapMounted } from '@/scopes/toolkit/createWrapMounted.js';
import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';
import { throwCssVarsBound } from '@/scopes/toolkit/throwCssVarsBound.js';

import { requestViewport } from './requestViewport.js';
import {
  state,
  mountError,
  isMounted,
  isCssVarsBound,
  isMounting,
} from './signals.js';
import type { GetCSSVarNameFn } from './types.js';
import type { State } from './types.js';

interface StorageValue {
  height: number;
  isExpanded: boolean;
  stableHeight: number;
  width: number;
}

const COMPONENT_NAME = 'viewport';
const wrapBasic = createWrapBasic(COMPONENT_NAME);
const wrapMounted = createWrapMounted(COMPONENT_NAME, isMounted);

/**
 * Creates CSS variables connected with the current viewport.
 *
 * By default, created CSS variables names are following the pattern "--tg-theme-{name}", where
 * {name} is a theme parameters key name converted from camel case to kebab case.
 *
 * Default variables:
 * - `--tg-viewport-height`
 * - `--tg-viewport-width`
 * - `--tg-viewport-stable-height`
 *
 * Variables are being automatically updated if the viewport was changed.
 *
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * viewport property.
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
export const bindCssVars = wrapMounted(
  'bindCssVars',
  (getCSSVarName?: GetCSSVarNameFn): VoidFunction => {
    isCssVarsBound() && throwCssVarsBound();

    getCSSVarName ||= (prop) => `--tg-viewport-${camelToKebab(prop)}`;
    const props = ['height', 'width', 'stableHeight'] as const;

    function actualize(): void {
      props.forEach(prop => {
        setCssVar(getCSSVarName!(prop), `${state()[prop]}px`);
      });
    }

    actualize();
    state.sub(actualize);
    isCssVarsBound.set(true);

    return () => {
      props.forEach(deleteCssVar);
      state.unsub(actualize);
      isCssVarsBound.set(false);
    };
  },
);

/**
 * A method that expands the Mini App to the maximum available height. To find out if the Mini
 * App is expanded to the maximum height, refer to the value of the `isExpanded`.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @see isExpanded
 * @example
 * if (expand.isAvailable()) {
 *   expand();
 * }
 */
export const expand = wrapBasic('expand', (): void => {
  postEvent('web_app_expand');
});

/**
 * Mounts the Viewport component.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_ALREADY_MOUNTING
 * @example
 * if (mount.isAvailable() && !isMounting()) {
 *   await mount();
 * }
 */
export const mount = wrapBasic(
  'mount',
  createMountFn<State>(
    COMPONENT_NAME,
    options => {
      // Try to restore the state using the storage.
      const s = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
      if (s) {
        return s;
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
        const w = window;
        return {
          isExpanded: true,
          height: w.innerHeight,
          width: w.innerWidth,
          stableHeight: w.innerHeight,
        };
      }

      // We were unable to retrieve data locally. In this case, we are sending
      // a request returning the viewport information.
      options.timeout ||= 1000;
      return requestViewport(options).then(data => ({
        height: data.height,
        isExpanded: data.isExpanded,
        stableHeight: data.isStable ? data.height : state().stableHeight,
        width: data.width,
      }));
    },
    result => {
      on('viewport_changed', onViewportChanged);
      setState(result);
    },
    { isMounted, isMounting, mountError },
  ),
);

const onViewportChanged: EventListener<'viewport_changed'> = (data) => {
  setState({
    height: data.height,
    isExpanded: data.is_expanded,
    stableHeight: data.is_state_stable ? data.height : state().stableHeight,
    width: data.width,
  });
};

function setState(s: State) {
  state.set({
    isExpanded: s.isExpanded,
    height: truncate(s.height),
    width: truncate(s.width),
    stableHeight: truncate(s.stableHeight),
  });
  setStorageValue<StorageValue>('viewport', state());
}

/**
 * Formats value to make it stay in bounds [0, +Inf).
 * @param value - value to format.
 */
function truncate(value: number): number {
  return Math.max(value, 0);
}

/**
 * Unmounts the Viewport.
 */
export function unmount(): void {
  off('viewport_changed', onViewportChanged);
  isMounted.set(false);
}
