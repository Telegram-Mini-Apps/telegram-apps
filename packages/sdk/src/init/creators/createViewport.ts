import { getStorageValue, saveStorageValue } from '~/storage.js';
import { requestViewport, Viewport } from '~/viewport/index.js';
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
    return new Viewport({
      height: window.innerHeight,
      isExpanded: true,
      postEvent,
      stableHeight: window.innerHeight,
      width: window.innerWidth,
    });
  }

  const state = getStorageValue('viewport');
  if (state) {
    return new Viewport({ ...state, postEvent });
  }

  return null;
}

/**
 * Synchronizes specified Viewport instance with Telegram application and always saves its state
 * in local storage.
 * @param viewport - Viewport instance.
 */
function bind(viewport: Viewport): Viewport {
  viewport.listen();

  // TODO: Should probably use throttle for height.
  viewport.on('change', () => saveStorageValue('viewport', {
    height: viewport.height,
    isExpanded: viewport.isExpanded,
    stableHeight: viewport.stableHeight,
    width: viewport.width,
  }));

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
    tryCreate(isPageReload, platform, postEvent) || new Viewport({
      width: 0,
      height: 0,
      isExpanded: false,
      postEvent,
      stableHeight: 0,
    }),
  );

  viewport.sync({ postEvent, timeout: 100 }).catch((e) => {
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
export async function createViewportAsync(
  isPageReload: boolean,
  platform: Platform,
  postEvent: PostEvent,
): Promise<Viewport> {
  return bind(
    tryCreate(isPageReload, platform, postEvent)
    || await requestViewport({ postEvent, timeout: 100 })
      .then(({ height, isStateStable, ...rest }) => new Viewport({
        ...rest,
        height,
        stableHeight: isStateStable ? height : 0,
      })),
  );
}
