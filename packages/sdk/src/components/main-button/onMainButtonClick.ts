import { on } from '@/bridge/events/listening/on.js';
import type { RemoveEventListenerFn } from '@/events/types.js';

import type { MainButtonClickListener } from './types.js';

/**
 * Adds a new MainButton click event listener.
 * @param listener - event listener.
 * @return Function which removes passed event listener.
 */
export function onMainButtonClick(listener: MainButtonClickListener): RemoveEventListenerFn {
  return on('main_button_pressed', listener);
}
