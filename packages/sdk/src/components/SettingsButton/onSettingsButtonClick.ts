import { on } from '@/bridge/events/listening/on.js';
import type { RemoveEventListenerFn } from '@/events/types.js';

import type { SettingsButtonClickListener } from './types.js';

/**
 * Adds a new SettingsButton click event listener.
 * @param listener - event listener.
 * @return Function which removes passed event listener.
 */
export function onSettingsButtonClick(
  listener: SettingsButtonClickListener,
): RemoveEventListenerFn {
  return on('settings_button_pressed', listener);
}
