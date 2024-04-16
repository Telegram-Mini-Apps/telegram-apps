import { createInitFn } from '@/components/createInitFn.js';
import { MainButton } from '@/components/main-button/MainButton.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

/**
 * @returns A new initialized instance of MainButton class.
 */
export const initMainButton = createInitFn(
  'mainButton',
  ({ postEvent }, state) => {
    const {
      buttonTextColor,
      buttonColor,
    } = retrieveLaunchParams().themeParams;

    return new MainButton({
      isVisible: false,
      isEnabled: false,
      text: '',
      isLoaderVisible: false,
      textColor: buttonTextColor || '#ffffff',
      backgroundColor: buttonColor || '#000000',
      postEvent,
      ...state,
    });
  },
);
