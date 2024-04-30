import { off } from '@/bridge/events/listening/off.js';

import type { BackButtonClickListener } from './types.js';

/**
 * Removes a BackButton click event listener.
 * @param listener - listener to remove.
 */
export function offBackButtonClick(listener: BackButtonClickListener): void {
  return off('back_button_pressed', listener);
}
