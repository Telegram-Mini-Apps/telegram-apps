import { miniAppsEventEmitter, resetMiniAppsEventEmitter } from '../event-emitter/singleton.js';
import type { MiniAppsEventListener, MiniAppsEventName } from '../types.js';

/**
 * Removes listener from specified event.
 * @param event - event to listen.
 * @param listener - event listener to remove.
 */
export function off<E extends MiniAppsEventName>(
  event: E,
  listener: MiniAppsEventListener<E>,
): void {
  const ee = miniAppsEventEmitter();
  const { count } = ee;
  ee.off(event, listener);

  // If event emitter now has no listeners, we can make a cleanup.
  if (count && !ee.count) {
    resetMiniAppsEventEmitter();
  }
}
