import { BackButton } from '@/features/BackButton/BackButton.js';
import { buttonOptions } from '@/fn-options/buttonOptions.js';
import { BackButtonFp } from '@/features/BackButton/BackButtonFp.js';
import type { BackButtonState } from '@/features/BackButton/types.js';

function options() {
  return buttonOptions<BackButtonState>('backButton', 'back_button_pressed');
}

/**
 * @internal
 */
export function instantiateBackButton() {
  return new BackButton(options());
}

/**
 * @internal
 */
export function instantiateBackButtonFp() {
  return new BackButtonFp(options());
}

export const backButton = instantiateBackButton();
export const backButtonFp = instantiateBackButtonFp();
