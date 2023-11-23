import type { MiniAppsGlobalEventListener } from './events.js';
import { singletonEmitter } from './singletonEmitter.js';

/**
 * Removes global event listener.
 * @param listener - event listener.
 */
export function unsubscribe(listener: MiniAppsGlobalEventListener): void {
  singletonEmitter().unsubscribe(listener);
}
