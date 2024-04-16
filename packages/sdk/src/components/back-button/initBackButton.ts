import { createInitFn } from '@/components/createInitFn.js';

import { BackButton } from './BackButton.js';

/**
 * @returns A new initialized instance of BackButton class.
 */
export const initBackButton = createInitFn('backButton', (
  { postEvent, version },
  { isVisible = false },
) => new BackButton(isVisible, version, postEvent));
