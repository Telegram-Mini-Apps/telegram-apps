import type { RemoveListenerFn } from '@telegram-apps/signals';

import { signalFor } from '@/events/listening/signalFor.js';
import type { EventName } from '@/events/types/events.js';
import type { EventListener } from '@/events/listening/types.js';

/**
 * Adds a new listener to the specified event.
 * @param event - event name.
 * @param listener - event listener.
 * @param once - should listener be called only once.
 * @returns Function to remove bound event listener.
 */
export function on<E extends EventName>(
  event: E,
  listener: EventListener<E>,
  once?: boolean,
): RemoveListenerFn {
  return signalFor(event).sub(listener, once);
}