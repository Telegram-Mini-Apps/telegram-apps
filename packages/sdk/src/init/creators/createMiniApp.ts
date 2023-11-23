import { MiniApp } from '~/mini-app/index.js';
import { getStorageValue, saveStorageValue } from '~/storage.js';
import type { PostEvent } from '~/bridge/index.js';
import type { RGB } from '~/colors/index.js';
import type { CreateRequestIdFunc, Platform } from '~/types/index.js';

/**
 * Creates MiniApp instance using last locally saved data also saving each state in
 * the storage.
 * @param isPageReload - was current page reloaded.
 * @param backgroundColor - web app background color.
 * @param version - platform version.
 * @param platform - platform identifier.
 * @param botInline - is Mini App launched in inline mode.
 * @param createRequestId - function which generates request identifiers.
 * @param postEvent - Bridge postEvent function
 */
export function createMiniApp(
  isPageReload: boolean,
  backgroundColor: RGB,
  version: string,
  platform: Platform,
  botInline: boolean,
  createRequestId: CreateRequestIdFunc,
  postEvent: PostEvent,
): MiniApp {
  const {
    backgroundColor: stateBackgroundColor = backgroundColor,
    headerColor = 'bg_color',
  } = isPageReload ? getStorageValue('mini-app') || {} : {};

  const component = new MiniApp(
    headerColor,
    stateBackgroundColor,
    version,
    platform,
    botInline,
    createRequestId,
    postEvent,
  );

  const saveState = () => saveStorageValue('mini-app', {
    backgroundColor: component.backgroundColor,
    headerColor: component.headerColor,
  });

  component.on('backgroundColorChanged', saveState);
  component.on('headerColorChanged', saveState);

  return component;
}
