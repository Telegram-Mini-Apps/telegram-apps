import { disposeMiniAppsEventEmitter, miniAppsEventEmitter } from '../event-emitter/singleton.js';
import type { MiniAppsSubscribeListener } from '../types.js';

/**
 * Removes global event listener.
 * @param listener - event listener.
 */
export function unsubscribe(listener: MiniAppsSubscribeListener): void {
  const ee = miniAppsEventEmitter();
  const { count } = ee;
  ee.unsubscribe(listener);

  // If event emitter now has no listeners, we can make a cleanup.
  if (count && !ee.count) {
    disposeMiniAppsEventEmitter();
  }
}
