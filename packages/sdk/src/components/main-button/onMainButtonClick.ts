import { on } from '@/bridge/events/on.js';
import type { RemoveEventListener } from '@/event-emitter/types.js';

import type { MainButtonClickListener } from './types.js';

/**
 * Adds a new MainButton click event listener.
 * @param listener - event listener.
 * @return Function which removes passed event listener.
 */
export function onMainButtonClick(listener: MainButtonClickListener): RemoveEventListener {
  return on('main_button_pressed', listener);
}
