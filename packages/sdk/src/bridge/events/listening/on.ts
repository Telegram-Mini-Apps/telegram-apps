import type { RemoveEventListenerFn } from '@/events/types.js';

import { miniAppsEventEmitter } from '../event-emitter/singleton.js';
import type { MiniAppsEventListener, MiniAppsEventName } from '../types.js';

/**
 * Adds new listener to the specified event. Returns handler
 * which allows to stop listening to event.
 * @param event - event name.
 * @param listener - event listener.
 * @param once - should listener be called only once.
 * @returns Function to remove bound event listener.
 */
export function on<E extends MiniAppsEventName>(
  event: E,
  listener: MiniAppsEventListener<E>,
  once?: boolean,
): RemoveEventListenerFn {
  return miniAppsEventEmitter().on(event, listener, once);
}
