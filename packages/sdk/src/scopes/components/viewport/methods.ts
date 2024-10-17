import {
  off,
  on,
  retrieveLaunchParams,
  camelToKebab,
  getStorageValue,
  setStorageValue,
  deleteCssVar,
  setCssVar,
  TypedError,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { postEvent } from '@/scopes/globals.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';
import { createMountFn } from '@/scopes/createMountFn.js';
import { subAndCall } from '@/utils/subAndCall.js';
import { withIsMounted } from '@/scopes/toolkit/withIsMounted.js';

import { type GetCSSVarNameFn, request } from './static.js';
import {
  state,
  mountError,
  isMounted,
  isCssVarsBound,
  isMounting,
} from './signals.js';
import type { State } from './types.js';

interface StorageValue {
  height: number;
  isExpanded: boolean;
  stableHeight: number;
  width: number;
}

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
 * Variables are being automatically updated if viewport was changed.
 *
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * viewport property.
 * @returns Function to stop updating variables.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const bindCssVars = withIsMounted((getCSSVarName?: GetCSSVarNameFn): VoidFunction => {
  if (isCssVarsBound()) {
    throw new TypedError(ERR_ALREADY_CALLED);
  }
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
}, isMounted);

/**
 * A method that expands the Mini App to the maximum available height. To find out if the Mini
 * App is expanded to the maximum height, refer to the value of the `isExpanded`.
 * @see isExpanded
 */
export function expand(): void {
  postEvent('web_app_expand');
}

function formatState(state: State): State {
  return {
    isExpanded: state.isExpanded,
    height: truncate(state.height),
    width: truncate(state.width),
    stableHeight: truncate(state.stableHeight),
  };
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export const mount = createMountFn<State>(
  options => {
    // Try to restore the state using the storage.
    const s = isPageReload() && getStorageValue<StorageValue>('viewport');
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

    // We were unable to retrieve data locally. In this case, we are sending a request returning
    // the viewport information.
    options.timeout ||= 1000;
    return request(options).then(data => ({
      height: data.height,
      isExpanded: data.isExpanded,
      stableHeight: data.isStable ? data.height : state().stableHeight,
      width: data.width,
    }));
  },
  result => {
    on('viewport_changed', onViewportChanged);
    subAndCall(state, onStateChanged);
    state.set(formatState(result));
  },
  { isMounted, isMounting, mountError },
);

const onViewportChanged: EventListener<'viewport_changed'> = (data) => {
  state.set(formatState({
    height: data.height,
    width: data.width,
    isExpanded: data.is_expanded,
    stableHeight: data.is_state_stable ? data.height : state().stableHeight,
  }));
};

function onStateChanged(): void {
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
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  off('viewport_changed', onViewportChanged);
  state.unsub(onStateChanged);
}
