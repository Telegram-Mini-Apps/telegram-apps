import { BackButton } from '@/features/BackButton/BackButton.js';
import { buttonOptions } from '@/fn-options/buttonOptions.js';

/**
 * @internal
 */
export function instantiateBackButton() {
  return new BackButton(buttonOptions('backButton', 'back_button_pressed'));
}

export const backButton = instantiateBackButton();
