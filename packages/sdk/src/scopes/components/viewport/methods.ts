import {
  off,
  on,
  retrieveLaunchParams,
  camelToKebab,
  getStorageValue,
  setStorageValue,
  deleteCssVar,
  setCssVar,
  type EventListener, CancelablePromise, AsyncOptions, TypedError,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { postEvent, request } from '@/scopes/globals.js';
import { createMountFn } from '@/scopes/createMountFn.js';
import { createWrapMounted } from '@/scopes/toolkit/createWrapMounted.js';
import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';
import { throwCssVarsBound } from '@/scopes/toolkit/throwCssVarsBound.js';
import { ERR_FULLSCREEN_FAILED } from '@/errors.js';
import { removeUndefined } from '@/utils/removeUndefined.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';
import { signalifyAsyncFn } from '@/scopes/signalifyAsyncFn.js';

import { requestViewport } from './requestViewport.js';
import {
  state,
  mountError,
  isMounted,
  isCssVarsBound,
  mountPromise,
  changeFullscreenPromise,
  changeFullscreenError,
  isFullscreen,
} from './signals.js';
import type { GetCSSVarNameFn } from './types.js';
import type { State } from './types.js';

type StorageValue = State;

const COMPONENT_NAME = 'viewport';
const FS_REQUEST_METHOD_NAME = 'web_app_request_fullscreen';
const FS_FAILED_EVENT_NAME = 'fullscreen_failed';
const FS_CHANGED_EVENT_NAME = 'fullscreen_changed';

const wrapBasic = createWrapBasic(COMPONENT_NAME);
const wrapMounted = createWrapMounted(COMPONENT_NAME, isMounted);
const wrapFSComplete = createWrapComplete(COMPONENT_NAME, isMounted, FS_REQUEST_METHOD_NAME);

/**
 * Creates CSS variables connected with the current viewport.
 *
 * By default, created CSS variables names are following the pattern
 * "--tg-theme-{name}", where
 * {name} is a theme parameters key name converted from camel case to kebab
 * case.
 *
 * Default variables:
 * - `--tg-viewport-height`
 * - `--tg-viewport-width`
 * - `--tg-viewport-stable-height`
 *
 * Variables are being automatically updated if the viewport was changed.
 *
 * @param getCSSVarName - function, returning complete CSS variable name for
 *   the specified viewport property.
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
 * A method that expands the Mini App to the maximum available height. To find
 * out if the Mini App is expanded to the maximum height, refer to the value of
 * the `isExpanded`.
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
export const mount = wrapBasic('mount', createMountFn(
  COMPONENT_NAME,
  (options) => {
    // Try to restore the state using the storage.
    const s = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
    if (s) {
      return s;
    }

    // If the platform has a stable viewport, it means we could use the
    // window global object properties.
    const lp = retrieveLaunchParams();
    const isFullscreen = !!lp.fullscreen;
    if (['macos', 'tdesktop', 'unigram', 'webk', 'weba', 'web'].includes(lp.platform)) {
      const w = window;
      return {
        isExpanded: true,
        isFullscreen,
        height: w.innerHeight,
        width: w.innerWidth,
        stableHeight: w.innerHeight,
      };
    }

    // We were unable to retrieve data locally. In this case, we are
    // sending a request returning the viewport information.
    return requestViewport(options).then(data => ({
      height: data.height,
      isExpanded: data.isExpanded,
      isFullscreen,
      stableHeight: data.isStable ? data.height : state().stableHeight,
      width: data.width,
    }));
  },
  () => {
    on('viewport_changed', onViewportChanged);
    on(FS_CHANGED_EVENT_NAME, onFullscreenChanged);
  },
  isMounted,
  state,
  mountPromise,
  mountError,
));

const onViewportChanged: EventListener<'viewport_changed'> = (data) => {
  setState({
    height: data.height,
    isExpanded: data.is_expanded,
    stableHeight: data.is_state_stable ? data.height : undefined,
    width: data.width,
  });
};

const onFullscreenChanged: EventListener<'fullscreen_changed'> = (data) => {
  setState({ isFullscreen: data.is_fullscreen });
};

function fsChangeGen(
  method: string,
  requestMethod: 'web_app_exit_fullscreen' | 'web_app_request_fullscreen',
) {
  return wrapFSComplete(method, signalifyAsyncFn(
    (options?: AsyncOptions): CancelablePromise<void> => {
      return request(requestMethod, [FS_CHANGED_EVENT_NAME, FS_FAILED_EVENT_NAME], options)
        .then(result => {
          if ('error' in result) {
            if (result.error === 'ALREADY_FULLSCREEN') {
              return true;
            }
            throw new TypedError(ERR_FULLSCREEN_FAILED, 'Fullscreen request failed', result.error);
          }
          return result.is_fullscreen;
        })
        .then(result => {
          isFullscreen() !== result && setState({ isFullscreen: result });
        });
    },
    () => new TypedError('abc'),
    changeFullscreenPromise,
    changeFullscreenError,
  ));
}

/**
 * Requests fullscreen mode for the mini application.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_FULLSCREEN_FAILED
 * @example Using `isAvailable()`
 * if (requestFullscreen.isAvailable() && !isChangingFullscreen()) {
 *   await requestFullscreen();
 * }
 * @example Using `ifAvailable()`
 * if (!isChangingFullscreen()) {
 *   await requestFullscreen.ifAvailable();
 * }
 */
export const requestFullscreen = fsChangeGen(
  'requestFullscreen',
  FS_REQUEST_METHOD_NAME,
);

/**
 * Exits mini application fullscreen mode.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_FULLSCREEN_FAILED
 * @example Using `isAvailable()`
 * if (exitFullscreen.isAvailable() && !isChangingFullscreen()) {
 *   await exitFullscreen();
 * }
 * @example Using `ifAvailable()`
 * if (!isChangingFullscreen()) {
 *   await exitFullscreen.ifAvailable();
 * }
 */
export const exitFullscreen = fsChangeGen(
  'exitFullscreen',
  'web_app_exit_fullscreen',
);

function setState(s: Partial<State>) {
  const { height, stableHeight, width } = s;

  state.set({
    ...state(),
    ...removeUndefined({
      ...s,
      height: height ? truncate(height) : undefined,
      width: width ? truncate(width) : undefined,
      stableHeight: stableHeight ? truncate(stableHeight) : undefined,
    }),
  });
  setStorageValue<StorageValue>(COMPONENT_NAME, state());
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
  // Cancel mount promise.
  const promise = mountPromise();
  promise && promise.cancel();

  // Remove event listeners.
  off('viewport_changed', onViewportChanged);
  off('fullscreen_changed', onFullscreenChanged);

  // Drop the mount flag.
  isMounted.set(false);
}
