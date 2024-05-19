import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { MainButton } from './MainButton.js';

/**
 * @returns A new initialized instance of the `MainButton` class.
 * @see MainButton
 */
export const initMainButton = createComponentInitFn(
  'mainButton',
  ({
    postEvent,
    themeParams,
    state = {
      isVisible: false,
      isEnabled: false,
      text: '',
      isLoaderVisible: false,
      textColor: themeParams.buttonTextColor || '#ffffff',
      bgColor: themeParams.buttonColor || '#000000',
    },
  }) => new MainButton({ ...state, postEvent }),
);
