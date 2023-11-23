import { getStorageValue, saveStorageValue } from '~/storage.js';
import { Viewport } from '~/viewport/index.js';
import type { PostEvent } from '~/bridge/index.js';
import type { Platform } from '~/types/index.js';

/**
 * Attempts to create Viewport instance using known parameters and local storage.
 * @param isPageReload - was page reloaded.
 * @param platform - platform identifier.
 * @param postEvent - Bridge postEvent function.
 */
function tryCreate(
  isPageReload: boolean,
  platform: Platform,
  postEvent: PostEvent,
): Viewport | null {
  if (isPageReload || platform === 'macos' || platform === 'web' || platform === 'weba') {
    return new Viewport(
      window.innerHeight,
      window.innerWidth,
      window.innerHeight,
      true,
      postEvent,
    );
  }

  const state = getStorageValue('viewport');
  if (state) {
    return new Viewport(
      state.height,
      state.width,
      state.stableHeight,
      state.isExpanded,
      postEvent,
    );
  }

  return null;
}

/**
 * Synchronizes specified Viewport instance with Telegram application and always saves its state
 * in local storage.
 * @param viewport - Viewport instance.
 */
function bind(viewport: Viewport): Viewport {
  viewport.sync();

  const saveState = () => saveStorageValue('viewport', {
    height: viewport.height,
    isExpanded: viewport.isExpanded,
    stableHeight: viewport.stableHeight,
    width: viewport.width,
  });

  // TODO: Should probably use throttle for height.
  viewport.on('heightChanged', saveState);
  viewport.on('isExpandedChanged', saveState);
  viewport.on('stableHeightChanged', saveState);
  viewport.on('widthChanged', saveState);

  return viewport;
}

/**
 * Creates Viewport instance using its actual state from the storage. Otherwise, creates it
 * with default parameters.
 * @param isPageReload - was page reloaded.
 * @param platform - platform identifier.
 * @param postEvent - Bridge postEvent function.
 */
export function createViewportSync(
  isPageReload: boolean,
  platform: Platform,
  postEvent: PostEvent,
): Viewport {
  const viewport = bind(
    tryCreate(isPageReload, platform, postEvent) || new Viewport(
      0,
      0,
      0,
      false,
      postEvent,
    ),
  );

  viewport
    .actualize({
      postEvent,
      timeout: 100,
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Unable to actualize viewport state', e);
    });

  return viewport;
}

/**
 * Creates Viewport instance using its actual state from the Telegram application.
 * @param isPageReload - was page reloaded.
 * @param platform - platform identifier.
 * @param postEvent - Bridge postEvent function.
 */
export function createViewportAsync(
  isPageReload: boolean,
  platform: Platform,
  postEvent: PostEvent,
): Promise<Viewport> {
  const viewport = tryCreate(isPageReload, platform, postEvent);

  return viewport
    ? Promise.resolve(viewport)
    : Viewport
      .request({ postEvent, timeout: 100 })
      .then(({ height, isExpanded, width, isStateStable }) => new Viewport(
        height,
        width,
        isStateStable ? height : 0,
        isExpanded,
        postEvent,
      ))
      .then(bind);
}
