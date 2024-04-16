import { singletonEmitter } from './singletonEmitter.js';
import type { MiniAppsGlobalEventListener } from './types/events.js';

/**
 * Removes global event listener.
 * @param listener - event listener.
 */
export function unsubscribe(listener: MiniAppsGlobalEventListener): void {
  singletonEmitter().unsubscribe(listener);
}
