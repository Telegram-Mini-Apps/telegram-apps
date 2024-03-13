import type { PostEvent } from '../../bridge/methods/postEvent.js';
import type { RGB } from '../../colors/types.js';
import { MiniApp } from '../../components/mini-app/MiniApp.js';
import { getStorageValue, saveStorageValue } from '../../storage.js';
import type { CreateRequestIdFunc } from '../../types/request-id.js';
import type { Version } from '../../version/types.js';

/**
 * Creates MiniApp instance using last locally saved data also saving each state in
 * the storage.
 * @param isPageReload - was current page reloaded.
 * @param backgroundColor - web app background color.
 * @param version - platform version.
 * @param botInline - is Mini App launched in inline mode.
 * @param createRequestId - function which generates request identifiers.
 * @param postEvent - Bridge postEvent function
 */
export function createMiniApp(
  isPageReload: boolean,
  backgroundColor: RGB,
  version: Version,
  botInline: boolean,
  createRequestId: CreateRequestIdFunc,
  postEvent: PostEvent,
): MiniApp {
  const {
    backgroundColor: stateBackgroundColor = backgroundColor,
    headerColor = 'bg_color',
  } = isPageReload ? getStorageValue('mini-app') || {} : {};

  const component = new MiniApp({
    headerColor,
    backgroundColor: stateBackgroundColor,
    version,
    botInline,
    createRequestId,
    postEvent,
  });

  const saveState = () => saveStorageValue('mini-app', {
    backgroundColor: component.backgroundColor,
    headerColor: component.headerColor,
  });

  component.on('change', saveState);

  return component;
}
