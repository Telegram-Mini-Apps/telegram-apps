import { SettingsButton } from '@/features/SettingsButton/SettingsButton.js';
import { buttonOptions } from '@/fn-options/buttonOptions.js';

export const settingsButton = new SettingsButton(
  buttonOptions('settingsButton', 'settings_button_pressed'),
);
