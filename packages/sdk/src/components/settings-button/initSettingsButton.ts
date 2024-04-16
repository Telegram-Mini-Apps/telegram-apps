import { createInitFn } from '@/components/createInitFn.js';
import { SettingsButton } from '@/components/settings-button/SettingsButton.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

/**
 * @returns A new initialized instance of SettingsButton class.
 */
export const initSettingsButton = createInitFn(
  'settingsButton',
  (
    { version, postEvent },
    { isVisible = retrieveLaunchParams().showSettings || false },
  ) => new SettingsButton(isVisible, version, postEvent),
);
