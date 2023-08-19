import { singletonEmitter } from './emitter.js';

import type { GlobalEventListener } from './events.js';

/**
 * Removes global event listener.
 * @param listener - event listener.
 */
export function unsubscribe(listener: GlobalEventListener): void {
  singletonEmitter().unsubscribe(listener);
}
