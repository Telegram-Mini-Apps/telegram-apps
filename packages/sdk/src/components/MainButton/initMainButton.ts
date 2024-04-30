import { createComponentInitFn } from '@/init/createComponentInitFn/createComponentInitFn.js';

import { MainButton } from './MainButton.js';

/**
 * @returns A new initialized instance of the `MainButton` class.
 * @see MainButton
 */
export const initMainButton = createInitFn<'mainButton', MainButton, 'themeParams'>('mainButton', ({
  postEvent,
  themeParams,
  state = {
    isVisible: false,
    isEnabled: false,
    text: '',
    isLoaderVisible: false,
    textColor: themeParams.buttonTextColor || '#ffffff',
    backgroundColor: themeParams.buttonColor || '#000000',
  },
}) => new MainButton({ ...state, postEvent }));
