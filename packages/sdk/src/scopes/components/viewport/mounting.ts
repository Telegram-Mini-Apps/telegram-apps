import { isPageReload } from '@telegram-apps/navigation';
import { type EventListener, off, on } from '@telegram-apps/bridge';
import { AbortablePromise } from 'better-promises';

import { defineMountFn } from '@/scopes/defineMountFn.js';
import { $launchParams } from '@/globals.js';
import { signalCancel } from '@/scopes/signalCancel.js';
import type { RequestOptionsNoCapture } from '@/types.js';

import { wrapBasic } from './wrappers.js';
import {
  COMPONENT_NAME,
  CSA_CHANGED_EVENT,
  FS_CHANGED_EVENT,
  SA_CHANGED_EVENT,
  VIEWPORT_CHANGED_EVENT,
} from './const.js';
import { contentSafeAreaInsets, getStateFromStorage, safeAreaInsets, setState } from './signals.js';
import { requestContentSafeAreaInsets, requestSafeAreaInsets, requestViewport } from './static.js';

const onViewportChanged: EventListener<'viewport_changed'> = (data) => {
  const { height } = data;
  setState({
    isExpanded: data.is_expanded,
    height,
    width: data.width,
    stableHeight: data.is_state_stable ? height : undefined,
  });
};

const onFullscreenChanged: EventListener<'fullscreen_changed'> = (data) => {
  setState({ isFullscreen: data.is_fullscreen });
};

const onSafeAreaChanged: EventListener<'safe_area_changed'> = (data) => {
  setState({ safeAreaInsets: data });
};

const onContentSafeAreaChanged: EventListener<'content_safe_area_changed'> = (data) => {
  setState({ contentSafeAreaInsets: data });
};

const [
  fn,
  tMountPromise,
  tMountError,
  tIsMounted,
] = defineMountFn(
  COMPONENT_NAME,
  (options?: RequestOptionsNoCapture) => {
    // Try to restore the state using the storage.
    const s = isPageReload() && getStateFromStorage();
    return s
      ? AbortablePromise.resolve(s)
      : AbortablePromise.fn(async context => {
        // Request all insets.
        const insets = await AbortablePromise.all([
          requestSafeAreaInsets.isAvailable()
            ? requestSafeAreaInsets(context)
            : safeAreaInsets(),
          requestContentSafeAreaInsets.isAvailable()
            ? requestContentSafeAreaInsets(context)
            : contentSafeAreaInsets(),
        ]);

        const lp = $launchParams();
        const shared = {
          contentSafeAreaInsets: insets[1],
          isFullscreen: !!lp.tgWebAppFullscreen,
          safeAreaInsets: insets[0],
        };

        // If the platform has a stable viewport, it means we could use the window global object
        // properties.
        if (['macos', 'tdesktop', 'unigram', 'webk', 'weba', 'web'].includes(lp.tgWebAppPlatform)) {
          const w = window;
          return {
            ...shared,
            height: w.innerHeight,
            isExpanded: true,
            stableHeight: w.innerHeight,
            width: w.innerWidth,
          };
        }

        // We were unable to retrieve data locally. In this case, we are
        // sending a request returning the viewport information.
        return requestViewport(context).then(data => ({
          ...shared,
          height: data.height,
          isExpanded: data.is_expanded,
          stableHeight: data.is_state_stable ? data.height : 0,
          width: data.width,
        }));
      }, options);
  },
  (result) => {
    on(VIEWPORT_CHANGED_EVENT, onViewportChanged);
    on(FS_CHANGED_EVENT, onFullscreenChanged);
    on(SA_CHANGED_EVENT, onSafeAreaChanged);
    on(CSA_CHANGED_EVENT, onContentSafeAreaChanged);
    setState(result);
  },
);

/**
 * Mounts the Viewport component.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {ConcurrentCallError} The component is already mounting
 * @example
 * if (mount.isAvailable() && !isMounting()) {
 *   await mount();
 * }
 */
export const mount = wrapBasic('mount', fn);
export const [, mountPromise, isMounting] = tMountPromise;
export const [, mountError] = tMountError;
export const [_isMounted, isMounted] = tIsMounted;

/**
 * Unmounts the Viewport.
 */
export function unmount(): void {
  signalCancel(mountPromise);
  off(VIEWPORT_CHANGED_EVENT, onViewportChanged);
  off(FS_CHANGED_EVENT, onFullscreenChanged);
  off(SA_CHANGED_EVENT, onSafeAreaChanged);
  off(CSA_CHANGED_EVENT, onContentSafeAreaChanged);
  _isMounted.set(false);
}
