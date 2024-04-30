import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

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
