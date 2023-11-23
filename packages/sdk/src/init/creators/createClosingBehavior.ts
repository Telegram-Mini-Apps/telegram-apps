import { ClosingBehavior } from '~/closing-behavior/index.js';
import { getStorageValue, saveStorageValue } from '~/storage.js';
import type { PostEvent } from '~/bridge/index.js';

/**
 * Creates ClosingBehaviour instance using last locally saved data also saving each state in
 * the storage.
 * @param isPageReload - was current page reloaded.
 * @param postEvent - Bridge postEvent function
 */
export function createClosingBehavior(
  isPageReload: boolean,
  postEvent: PostEvent,
): ClosingBehavior {
  const { isConfirmationNeeded = false } = isPageReload ? getStorageValue('closing-behavior') || {} : {};

  const component = new ClosingBehavior(isConfirmationNeeded, postEvent);

  component.on('isConfirmationNeededChanged', () => saveStorageValue('closing-behavior', {
    isConfirmationNeeded: component.isConfirmationNeeded,
  }));

  return component;
}
