import type { PostEvent } from '@tma.js/bridge';

import { ClosingBehaviour } from '../../components/index.js';

import { getStorageValue, saveStorageValue } from '../../storage.js';

/**
 * Creates ClosingBehaviour instance using last locally saved data also saving each state in
 * the storage.
 * @param isPageReload - was current page reloaded.
 * @param postEvent - Bridge postEvent function
 */
export function createClosingBehavior(
  isPageReload: boolean,
  postEvent: PostEvent,
): ClosingBehaviour {
  const { isConfirmationNeeded = false } = isPageReload ? getStorageValue('closing-behavior') || {} : {};

  const component = new ClosingBehaviour(isConfirmationNeeded, postEvent);

  component.on('isConfirmationNeededChanged', () => saveStorageValue('closing-behavior', {
    isConfirmationNeeded: component.isConfirmationNeeded,
  }));

  return component;
}
