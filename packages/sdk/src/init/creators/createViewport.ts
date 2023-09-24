import type { PostEvent } from '@twa.js/bridge';

import { Viewport } from '../../components/index.js';

import { getStorageValue, saveStorageValue } from '../../storage.js';

import type { Platform } from '../../types.js';

/**
 * Creates Viewport instance using last locally saved data also saving each state in
 * the storage.
 * @param platform - Telegram Web Apps platform name.
 * @param postEvent - Bridge postEvent function
 */
export async function createViewport(platform: Platform, postEvent: PostEvent): Promise<Viewport> {
  const {
    height = window.innerHeight,
    stableHeight = window.innerHeight,
    width = window.innerWidth,
    isExpanded = false,
  } = getStorageValue('viewport') || {};

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
