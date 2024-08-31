import { type Signal, signal } from '@telegram-apps/signals';
import type { If, IsNever } from '@telegram-apps/toolkit';

import { lastEventSignal } from '@/events/listening/lastEvent.js';
import type { EventName, EventPayload } from '@/events/types/events.js';

export type SignalPayload<E extends EventName> = If<
  IsNever<EventPayload<E>>,
  undefined,
  EventPayload<E>
>;

type CachedSignal<E extends EventName> = Signal<SignalPayload<E> | undefined, SignalPayload<E>>
type Cache = {
  [E in EventName]?: CachedSignal<E>
};

export const $eventSignalsCache = signal<Cache>({});

/**
 * Returns a signal for specified event using cache.
 * @param event - event name.
 */
export function signalFor<E extends EventName>(event: E): CachedSignal<E> {
  let cached = $eventSignalsCache()[event];
  if (!cached) {
    // This is the special symbol we use to notify signal, that nothing changed, and the current
    // value should be preserved.
    cached = signal() as Cache[E];
    lastEventSignal().sub(ev => {
      if (ev && ev[0] === event) {
        cached!.set(ev[1] as SignalPayload<E>);
      }
    });

    $eventSignalsCache.set({ ...$eventSignalsCache(), [event]: cached });
  }

  return cached as CachedSignal<E>;
}