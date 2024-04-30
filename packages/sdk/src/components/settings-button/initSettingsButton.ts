import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

import { SettingsButton } from './SettingsButton.js';

/**
 * @returns A new initialized instance of the `SettingsButton` class.
 * @see SettingsButton
 */
export const initSettingsButton = createInitFn<'settingsButton', SettingsButton, 'version'>('settingsButton', ({
  version,
  postEvent,
  state = { isVisible: false },
}) => new SettingsButton(state.isVisible, version, postEvent));
