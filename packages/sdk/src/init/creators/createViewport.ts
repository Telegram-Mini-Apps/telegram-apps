import { getStorageValue, saveStorageValue } from '~/storage.js';
import {
  isStableViewportPlatform,
  requestViewport,
  Viewport,
} from '~/viewport/index.js';
import type { PostEvent } from '~/bridge/index.js';
import type { Platform } from '~/types/index.js';

/**
 * Synchronizes specified Viewport instance with Telegram application and always saves its state
 * in local storage.
 * @param viewport - Viewport instance.
 */
function bind(viewport: Viewport): void {
  // TODO: Should probably use throttle for height.
  viewport.on('change', () => saveStorageValue('viewport', {
    height: viewport.height,
    isExpanded: viewport.isExpanded,
    stableHeight: viewport.stableHeight,
    width: viewport.width,
  }));

  viewport.listen();
}

function create(
  isPageReload: boolean,
  platform: Platform,
  postEvent: PostEvent,
  complete: boolean,
): Viewport | Promise<Viewport> {
  // If page was reloaded, we expect viewport to be restored from the storage.
  const state = isPageReload ? getStorageValue('viewport') : null;
  if (state) {
    return new Viewport({ ...state, postEvent });
  }

  // If platform has a stable viewport, it means we could instantiate Viewport using
  // the window global object properties.
  if (isStableViewportPlatform(platform)) {
    return new Viewport({
      height: window.innerHeight,
      isExpanded: true,
      postEvent,
      stableHeight: window.innerHeight,
      width: window.innerWidth,
    });
  }

  return complete
    // If initialization is complete, we have to create Viewport instance using its actual
    // state from the Telegram application..
    ? requestViewport({
      postEvent,
      timeout: 5000,
    })
      .then(({ height, isStateStable, ...rest }) => new Viewport({
        ...rest,
        height,
        stableHeight: isStateStable ? height : 0,
      }))
    // Otherwise we have no sources to get viewport properties from. In this case we just
    // return some "empty" Viewport instance.
    : new Viewport({
      width: 0,
      height: 0,
      isExpanded: false,
      postEvent,
      stableHeight: 0,
    });
}

/**
 * Creates Viewport instance using its actual state from the Telegram application.
 * @param isPageReload - was page reloaded.
 * @param platform - platform identifier.
 * @param postEvent - Bridge postEvent function.
 * @param complete - is initialization complete.
 */
export function createViewport(
  isPageReload: boolean,
  platform: Platform,
  postEvent: PostEvent,
  complete: boolean,
): Viewport | Promise<Viewport> {
  // Instantiate Viewport.
  const viewport = create(isPageReload, platform, postEvent, complete);

  // If viewport appeared to be instance of Promise, it needs no synchronization. We wait for
  // the viewport data to be retrieved and start listening to its changes.
  if (viewport instanceof Promise) {
    return viewport.then((v) => {
      bind(v);
      return v;
    });
  }

  // Viewport is not a promise. We start listening to its changes and in case, platform
  // doesn't have a stable viewport, we are synchronizing it with the Telegram application.
  bind(viewport);

  if (!isStableViewportPlatform(platform)) {
    viewport.sync({ postEvent, timeout: 5000 }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Unable to actualize viewport state', e);
    });
  }

  return viewport;
}
