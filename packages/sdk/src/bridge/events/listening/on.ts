import { off } from '@/bridge/events/listening/off.js';
import type { RemoveEventListenerFn } from '@/events/types.js';

import { miniAppsEventEmitter } from '../event-emitter/singleton.js';
import type { MiniAppsEventListener, MiniAppsEventName } from '../types.js';

/**
 * Adds new listener to the specified event. Returns handler
 * which allows to stop listening to event.
 * @param event - event name.
 * @param listener - event listener.
 * @returns Function to remove bound event listener.
 */
export function on<E extends MiniAppsEventName>(
  event: E,
  listener: MiniAppsEventListener<E>,
): RemoveEventListenerFn {
  miniAppsEventEmitter().on(event, listener);
  return () => off(event, listener);
}
