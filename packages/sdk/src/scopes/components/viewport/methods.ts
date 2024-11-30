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
  isMounting, mountPromise,
} from './signals.js';
import type { GetCSSVarNameFn } from './types.js';
import type { State } from './types.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';
import { ERR_ALREADY_MOUNTING } from '@/errors.js';
import { batch } from '@telegram-apps/signals';
import { removeUndefined } from '@/utils/removeUndefined.js';

type StorageValue = State;

const COMPONENT_NAME = 'viewport';
const REQUEST_FS_METHOD_NAME = 'web_app_request_fullscreen';
const EXIT_FS_METHOD_NAME = 'web_app_exit_fullscreen';
const wrapBasic = createWrapBasic(COMPONENT_NAME);
const wrapMounted = createWrapMounted(COMPONENT_NAME, isMounted);
// const wrapFSSupported = createWrapSupported(COMPONENT_NAME,
// REQUEST_FS_METHOD_NAME)

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

function retrieveState(options?: AsyncOptions): CancelablePromise<State> {
  // Try to restore the state using the storage.
  const s = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
  if (s) {
    return CancelablePromise.resolve(s);
  }

  // If the platform has a stable viewport, it means we could use the
  // window global object properties.
  const lp = retrieveLaunchParams();
  const isFullscreen = !!lp.fullscreen;
  if (['macos', 'tdesktop', 'unigram', 'webk', 'weba', 'web'].includes(lp.platform)) {
    const w = window;
    return CancelablePromise.resolve({
      isExpanded: true,
      isFullscreen,
      height: w.innerHeight,
      width: w.innerWidth,
      stableHeight: w.innerHeight,
    });
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
}

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
  (options?: AsyncOptions): CancelablePromise<State> => {
    return CancelablePromise.withFn<State>(async abortSignal => {
      // We prevent calling several concurrent mount processes. We would
      // allow it but only in case, the current function wouldn't
      // accept any options.
      if (isMounting()) {
        throw new TypedError(
          ERR_ALREADY_MOUNTING,
          `The ${COMPONENT_NAME} component is already mounting`,
        );
      }

      // The component is already mounted, return its state.
      if (isMounted()) {
        return state();
      }

      // Start mounting process.
      const promise = retrieveState({ abortSignal });
      mountPromise.set(promise);
      let result: [true, State] | [false, Error];
      try {
        result = [true, await promise];
      } catch (e) {
        result = [false, e as Error];
      }

      // Actualize all related signals state.
      batch(() => {
        mountPromise.set(undefined);
        if (result[0]) {
          state.set(result[1]);
          on('viewport_changed', onViewportChanged);
          on('fullscreen_changed', onFullscreenChanged);
        } else {
          mountError.set(result[1]);
        }
      });

      if (!result[0]) {
        throw result[1];
      }
      return result[1];
    }, options);
  },
);

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
