import type { RemoveEventListenerFn } from '@/events/types.js';

import { miniAppsEventEmitter, resetMiniAppsEventEmitter } from './event-emitter/singleton.js';
import type { EventName, EventListener, SubscribeListener } from '@/bridge/events/types.js';

/**
 * Removes listener from specified event.
 * @param event - event to listen.
 * @param listener - event listener to remove.
 */
export function off<E extends EventName>(event: E, listener: EventListener<E>): void {
  miniAppsEventEmitter().off(event, listener);
}

/**
 * Adds new listener to the specified event. Returns handler
 * which allows to stop listening to event.
 * @param event - event name.
 * @param listener - event listener.
 * @param once - should listener be called only once.
 * @returns Function to remove bound event listener.
 */
export function on<E extends EventName>(
  event: E,
  listener: EventListener<E>,
  once?: boolean,
): RemoveEventListenerFn {
  return miniAppsEventEmitter().on(event, listener, once);
}

/**
 * Subscribes to all events sent from the native Telegram application.
 * @param listener - event listener to bind.
 * @returns Function to remove bound event listener.
 */
export function subscribe(listener: SubscribeListener): RemoveEventListenerFn {
  miniAppsEventEmitter().subscribe(listener);
  return () => unsubscribe(listener);
}

/**
 * Removes global event listener.
 * @param listener - event listener.
 */
export function unsubscribe(listener: SubscribeListener): void {
  const ee = miniAppsEventEmitter();
  const { count } = ee;
  ee.unsubscribe(listener);

  // If event emitter now has no listeners, we can make a cleanup.
  if (count && !ee.count) {
    resetMiniAppsEventEmitter();
  }
}
