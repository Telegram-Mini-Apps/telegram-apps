import { on } from '@/bridge/events/on.js';
import type { RemoveEventListener } from '@/event-emitter/types.js';

import type { SettingsButtonClickListener } from './types.js';

/**
 * Adds a new SettingsButton click event listener.
 * @param listener - event listener.
 * @return Function which removes passed event listener.
 */
export function onSettingsButtonClick(listener: SettingsButtonClickListener): RemoveEventListener {
  return on('settings_button_pressed', listener);
}
