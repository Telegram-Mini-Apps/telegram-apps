import { MainButton } from '@/features/MainButton/MainButton.js';
import { bottomButtonOptions } from '@/fn-options/bottomButtonOptions.js';

/**
 * @internal
 */
export function instantiateMainButton() {
  return new MainButton(
    bottomButtonOptions('mainButton', 'main_button_pressed', {
      // FIXME
      bgColor: '#000',
      textColor: '#000',
    }),
  );
}

export const mainButton = instantiateMainButton();
