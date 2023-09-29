import type { PostEvent } from '@tma.js/bridge';

import { ClosingBehaviour } from '../../components/index.js';

import { getStorageValue, saveStorageValue } from '../../storage.js';

/**
 * Creates ClosingBehaviour instance using last locally saved data also saving each state in
 * the storage.
 * @param postEvent - Bridge postEvent function
 */
export function createClosingBehavior(postEvent: PostEvent): ClosingBehaviour {
  const { isConfirmationNeeded = false } = getStorageValue('closing-behavior') || {};

  const component = new ClosingBehaviour(isConfirmationNeeded, postEvent);

  component.on('isConfirmationNeededChanged', () => saveStorageValue('closing-behavior', {
    isConfirmationNeeded: component.isConfirmationNeeded,
  }));

  return component;
}
