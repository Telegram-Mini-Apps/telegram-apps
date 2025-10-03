import { SettingsButton } from '@/features/SettingsButton/SettingsButton.js';
import { buttonOptions } from '@/fn-options/buttonOptions.js';

/**
 * @internal
 */
export function instantiateSettingsButton() {
  return new SettingsButton(buttonOptions('settingsButton', 'settings_button_pressed'));
}

export const settingsButton = instantiateSettingsButton();
