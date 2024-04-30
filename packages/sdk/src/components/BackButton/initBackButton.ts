import { createComponentInitFn } from '@/init/createComponentInitFn/createComponentInitFn.js';

import { BackButton } from './BackButton.js';

/**
 * @returns A new initialized instance of the `BackButton` class.
 * @see BackButton
 */
export const initBackButton = createInitFn<'backButton', BackButton, 'version'>('backButton', ({
  postEvent,
  version,
  state = { isVisible: false },
}) => new BackButton(state.isVisible, version, postEvent));
