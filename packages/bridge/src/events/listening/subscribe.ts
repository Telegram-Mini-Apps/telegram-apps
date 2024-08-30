import type { SubscribeListenerFn, RemoveListenerFn } from '@telegram-apps/signals';

import { type LastEvent, lastEventSignal } from '@/events/listening/lastEvent.js';

/**
 * Subscribes to all events sent from the native Telegram application.
 * @param listener - event listener to bind.
 * @param once - should this listener be called only once.
 * @returns Function to remove bound event listener.
 */
export function subscribe(
  listener: SubscribeListenerFn<LastEvent | undefined>,
  once?: boolean,
): RemoveListenerFn {
  return lastEventSignal().sub(listener, once);
}
