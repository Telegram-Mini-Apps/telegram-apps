import type { MiniAppsEventListener, MiniAppsEventName } from './events.js';
import { singletonEmitter } from './singletonEmitter.js';

/**
 * Removes listener from specified event.
 * @param event - event to listen.
 * @param listener - event listener.
 */
export function off<E extends MiniAppsEventName>(
  event: E,
  listener: MiniAppsEventListener<E>,
): void {
  singletonEmitter().off(event, listener);
}
