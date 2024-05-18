import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { BackButton } from './BackButton.js';

/**
 * @returns A new initialized instance of the `BackButton` class.
 * @see BackButton
 */
export const initBackButton = createComponentInitFn('backButton', ({
  postEvent,
  version,
  state = { isVisible: false },
}) => new BackButton(state.isVisible, version, postEvent));
