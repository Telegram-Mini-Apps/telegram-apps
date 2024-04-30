import { on } from '@/bridge/events/listening/on.js';
import type { RemoveEventListenerFn } from '@/events/types.js';

import type { BackButtonClickListener } from './types.js';

/**
 * Adds a new BackButton click event listener.
 * @param listener - event listener.
 * @return Function which removes passed event listener.
 */
export function onBackButtonClick(listener: BackButtonClickListener): RemoveEventListenerFn {
  return on('back_button_pressed', listener);
}
