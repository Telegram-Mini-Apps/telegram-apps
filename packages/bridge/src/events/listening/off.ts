import type { SubscribeListenerFn } from '@telegram-apps/signals';

import { signalFor, type SignalPayload } from '@/events/listening/signalFor.js';
import type { EventName } from '@/events/types/events.js';

/**
 * Removes the listener from the specified event.
 * @param event - event to listen.
 * @param listener - event listener to remove.
 * @param once - had this listener to be called only once.
 */
export function off<E extends EventName>(
  event: E,
  listener: SubscribeListenerFn<SignalPayload<E>, SignalPayload<E> | undefined>,
  once?: boolean,
): void {
  signalFor(event).unsub(listener, once);
}
