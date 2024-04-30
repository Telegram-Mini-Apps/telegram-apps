import { createComponentInitFn } from '@/init/createComponentInitFn/createComponentInitFn.js';

import { SettingsButton } from './SettingsButton.js';

/**
 * @returns A new initialized instance of the `SettingsButton` class.
 * @see SettingsButton
 */
export const initSettingsButton = createComponentInitFn<'settingsButton', SettingsButton, 'version'>('settingsButton', ({
  version,
  postEvent,
  state = { isVisible: false },
}) => new SettingsButton(state.isVisible, version, postEvent));
