import { off } from '@/bridge/events/listening/off.js';

import type { MainButtonClickListener } from './types.js';

/**
 * Removes a MainButton click event listener.
 * @param listener - listener to remove.
 */
export function offMainButtonClick(listener: MainButtonClickListener): void {
  return off('back_button_pressed', listener);
}
