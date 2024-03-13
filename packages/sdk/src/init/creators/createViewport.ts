import type { PostEvent } from '../../bridge/methods/postEvent.js';
import { isStableViewportPlatform } from '../../components/viewport/isStableViewportPlatform.js';
import { requestViewport } from '../../components/viewport/requestViewport.js';
import type { ViewportProps } from '../../components/viewport/types.js';
import { Viewport } from '../../components/viewport/Viewport.js';
import { getStorageValue, saveStorageValue } from '../../storage.js';
import type { Platform } from '../../types/platform.js';

/**
 * Creates new bound instance of the Viewport component.
 * @param props - properties to create new instance.
 */
function instantiate(props: ViewportProps): Viewport {
  const viewport = new Viewport(props);

  // TODO: Should probably use throttle for height.
  viewport.on('change', () => saveStorageValue('viewport', {
    height: viewport.height,
    isExpanded: viewport.isExpanded,
    stableHeight: viewport.stableHeight,
    width: viewport.width,
  }));

  viewport.listen();

  return viewport;
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
  // If page was reloaded, we expect viewport to be restored from the storage.
  const state = isPageReload ? getStorageValue('viewport') : null;
  if (state) {
    return instantiate({ ...state, postEvent });
  }

  // If platform has a stable viewport, it means we could instantiate Viewport using
  // the window global object properties.
  if (isStableViewportPlatform(platform)) {
    return instantiate({
      height: window.innerHeight,
      isExpanded: true,
      postEvent,
      stableHeight: window.innerHeight,
      width: window.innerWidth,
    });
  }

  // If initialization is complete, we have to create Viewport instance using its actual
  // state from the Telegram application.
  if (complete) {
    return requestViewport({
      postEvent,
      timeout: 5000,
    })
      .then(({ height, isStateStable, ...rest }) => instantiate({
        ...rest,
        height,
        stableHeight: isStateStable ? height : 0,
      }));
  }

  // Otherwise we have no sources to get viewport properties from. In this case we just
  // return some "empty" Viewport instance and synchronize it in the background.
  const viewport = instantiate({
    width: 0,
    height: 0,
    isExpanded: false,
    postEvent,
    stableHeight: 0,
  });

  /* c8 ignore start */
  viewport.sync({ postEvent, timeout: 5000 }).catch((e) => {
    // eslint-disable-next-line no-console
    console.error('Unable to actualize viewport state', e);
  });
  /* c8 ignore stop */

  return viewport;
}
