import { miniAppsEventEmitter } from '../event-emitter/singleton.js';
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
  miniAppsEventEmitter().off(event, listener);
}
