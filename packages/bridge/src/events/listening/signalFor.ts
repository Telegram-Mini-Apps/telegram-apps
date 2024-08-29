import { computed, type Computed, signal } from '@telegram-apps/signals';
import type { If, IsNever } from '@telegram-apps/toolkit';

import { lastEventSignal } from '@/events/lastEvent.js';
import type { EventName, EventPayload } from '@/events/types/events.js';

export type SignalPayload<E extends EventName> = If<
  IsNever<EventPayload<E>>,
  undefined,
  EventPayload<E>
>;

type Cache = {
  [E in EventName]?: Computed<SignalPayload<E>>
};

export const $eventSignalsCache = signal<Cache>({});

/**
 * Returns a signal for specified event using cache.
 * @param event - event name.
 */
export function signalFor<E extends EventName>(event: E): Computed<SignalPayload<E>> {
  let cached = $eventSignalsCache()[event];
  if (!cached) {
    const lastEvent = lastEventSignal();
    cached = computed<SignalPayload<E> | undefined>((prev) => {
      const ev = lastEvent();
      return ev && ev[0] === event
        ? ev[1] as SignalPayload<E>
        : prev;

      // Using "as Cache[E]" here we are tricking TypeScript on purpose. The problem here is
      // that some events can't contain undefined as their payload, but the code above allows
      // this value for them. In case, we would use the signal returned from this function
      // using the call signature (mySignal()), we would surely meet a bug, but as long as
      // we are using only subscription manipulation methods, this bug will not be met.
      //
      // Nevertheless, we are covering this code with tests to make sure everything
      // works as expected.
    }) as Cache[E];
    $eventSignalsCache.set({ ...$eventSignalsCache(), [event]: cached });
  }

  return cached as Computed<SignalPayload<E>>;
}