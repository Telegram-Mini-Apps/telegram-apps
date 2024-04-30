import { off } from '@/bridge/events/listening/off.js';

import type { SettingsButtonClickListener } from './types.js';

/**
 * Removes a SettingsButton click event listener.
 * @param listener - listener to remove.
 */
export function offSettingsButtonClick(listener: SettingsButtonClickListener): void {
  return off('settings_button_pressed', listener);
}
