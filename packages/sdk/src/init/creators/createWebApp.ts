import type { RGB } from '@tma.js/colors';
import type { PostEvent } from '@tma.js/bridge';

import { WebApp } from '../../components/index.js';

import { getStorageValue, saveStorageValue } from '../../storage.js';

import type { CreateRequestIdFunc, Platform } from '../../types.js';

/**
 * Creates WebApp instance using last locally saved data also saving each state in
 * the storage.
 * @param backgroundColor - web app background color.
 * @param version - platform version.
 * @param platform - Telegram Web Apps platform name.
 * @param createRequestId - function which generates request identifiers.
 * @param postEvent - Bridge postEvent function
 */
export function createWebApp(
  backgroundColor: RGB,
  version: string,
  platform: Platform,
  createRequestId: CreateRequestIdFunc,
  postEvent: PostEvent,
): WebApp {
  const {
    backgroundColor: stateBackgroundColor = backgroundColor,
    headerColor = 'bg_color',
  } = getStorageValue('web-app') || {};

  const component = new WebApp(
    headerColor,
    stateBackgroundColor,
    version,
    platform,
    createRequestId,
    postEvent,
  );

  const saveState = () => saveStorageValue('web-app', {
    backgroundColor: component.backgroundColor,
    headerColor: component.headerColor,
  });

  component.on('backgroundColorChanged', saveState);
  component.on('headerColorChanged', saveState);

  return component;
}
