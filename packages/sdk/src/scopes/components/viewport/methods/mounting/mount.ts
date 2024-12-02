import { isPageReload } from '@telegram-apps/navigation';
import { CancelablePromise, on, retrieveLaunchParams } from '@telegram-apps/bridge';

import { createMountFn } from '@/scopes/createMountFn.js';

import { wrapBasic } from '../wrappers.js';
import {
  COMPONENT_NAME,
  CSA_CHANGED_EVENT,
  FS_CHANGED_EVENT,
  SA_CHANGED_EVENT,
  VIEWPORT_CHANGED_EVENT
} from '../../const.js';
import { isMounted, mountPromise, mountError } from '../../signals/mounting.js';
import { getStateFromStorage, setState } from '../../signals/state.js';
import { safeAreaInsets } from '../../signals/safe-area-insets.js';
import { contentSafeAreaInsets } from '../../signals/content-safe-area-insets.js';
import { requestContentSafeAreaInsets } from '../static/requestContentSafeAreaInsets.js';
import { requestSafeAreaInsets } from '../static/requestSafeAreaInsets.js';
import { requestViewport } from '../static/requestViewport.js';
import type { State } from '../../types.js';

import { onContentSafeAreaChanged, onFullscreenChanged, onSafeAreaChanged, onViewportChanged } from './shared.js';

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
export const mount = wrapBasic('mount', createMountFn<State>(
  COMPONENT_NAME,
  (options) => {
    return CancelablePromise.resolve().then(async () => {
      // Try to restore the state using the storage.
      const s = isPageReload() && getStateFromStorage();
      if (s) {
        return s;
      }

      // Request all insets.
      const [
        retrievedSafeAreaInsets,
        retrievedContentSafeAreaInsets,
      ] = await CancelablePromise.all([
        requestSafeAreaInsets.ifAvailable(options) || safeAreaInsets(),
        requestContentSafeAreaInsets.ifAvailable(options) || contentSafeAreaInsets(),
      ]);

      // If the platform has a stable viewport, it means we could use the window global object
      // properties.
      const lp = retrieveLaunchParams();
      const shared = {
        contentSafeAreaInsets: retrievedContentSafeAreaInsets,
        isFullscreen: !!lp.fullscreen,
        safeAreaInsets: retrievedSafeAreaInsets,
      };
      if (['macos', 'tdesktop', 'unigram', 'webk', 'weba', 'web'].includes(lp.platform)) {
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
      return requestViewport(options).then(data => ({
        ...shared,
        height: data.height,
        isExpanded: data.isExpanded,
        stableHeight: data.isStable ? data.height : 0,
        width: data.width,
      }));
    });
  },
  (result) => {
    on(VIEWPORT_CHANGED_EVENT, onViewportChanged);
    on(FS_CHANGED_EVENT, onFullscreenChanged);
    on(SA_CHANGED_EVENT, onSafeAreaChanged);
    on(CSA_CHANGED_EVENT, onContentSafeAreaChanged);
    setState(result);
  },
  isMounted,
  mountPromise,
  mountError,
));
