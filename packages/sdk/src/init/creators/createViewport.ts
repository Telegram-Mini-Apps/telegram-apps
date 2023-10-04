import type { PostEvent } from '@tma.js/bridge';
import type { Platform } from '@tma.js/launch-params';

import { Viewport } from '../../components/index.js';

import { getStorageValue, saveStorageValue } from '../../storage.js';

/**
 * Creates Viewport instance using last locally saved data also saving each state in
 * the storage.
 * @param isPageReload - was current page reloaded.
 * @param platform - Telegram Web Apps platform name.
 * @param postEvent - Bridge postEvent function
 */
export async function createViewport(
  isPageReload: boolean,
  platform: Platform,
  postEvent: PostEvent,
): Promise<Viewport> {
  const {
    height = window.innerHeight,
    stableHeight = window.innerHeight,
    width = window.innerWidth,
    isExpanded = false,
  } = isPageReload ? getStorageValue('viewport') || {} : {};

  const createSynced = () => {
    const viewport = new Viewport(height, width, stableHeight, isExpanded, postEvent);
    Viewport.sync(viewport);

    return viewport;
  };

  // MacOS and Web K versions do not support requesting current viewport information. That's why we
  // should construct Viewport instance by ourselves.
  const component = platform === 'macos' || platform === 'web'
    ? createSynced()
    : await Viewport.synced({ postEvent });

  const saveState = () => saveStorageValue('viewport', {
    height: component.height,
    isExpanded: component.isExpanded,
    stableHeight: component.stableHeight,
    width: component.width,
  });

  // TODO: Should probably use throttle for height.
  component.on('heightChanged', saveState);
  component.on('isExpandedChanged', saveState);
  component.on('stableHeightChanged', saveState);
  component.on('widthChanged', saveState);

  return component;
}
