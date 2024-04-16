import { on } from '@/bridge/events/on.js';
import type { RemoveEventListener } from '@/event-emitter/types.js';

import type { BackButtonClickListener } from './types.js';

/**
 * Adds a new BackButton click event listener.
 * @param listener - event listener.
 * @return Function which removes passed event listener.
 */
export function onBackButtonClick(listener: BackButtonClickListener): RemoveEventListener {
  return on('back_button_pressed', listener);
}
