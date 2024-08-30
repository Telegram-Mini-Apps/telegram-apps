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

    // This is the special symbol we use to notify signal, that nothing changed, and the current
    // value should be preserved.
    const noop = Symbol();

    cached = computed<SignalPayload<E> | symbol>(() => {
      const ev = lastEvent();

      // If any event was received and its name is the same as we are waiting for, return
      // the payload.
      //
      // It is important to mention that some events don't have any payload (undefined, literally),
      // so returning undefined again and again will not call the signal subscribers, until
      // some special logic in the "equals" option is written.
      //
      // We could solve this problem using this option and not comparing undefined and
      // undefined and returning true, but then we would call subscribers even when the caught
      // event was not the target one at all.
      //
      // Due to this reason, we have to add some special value notifying the signal about nothing
      // changed. Then, we use it in the "equals" check.
      return ev && ev[0] === event ? ev[1] as SignalPayload<E> : noop;
    }, {
      equals(_, incoming) {
        return incoming === noop;
      },

      // Using "as Cache[E]" here we are tricking TypeScript on purpose. The problem here is
      // that some events can't contain "noop" value as their payload, but the code above allows
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