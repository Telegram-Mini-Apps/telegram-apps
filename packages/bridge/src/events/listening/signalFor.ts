import { type Signal, signal } from '@telegram-apps/signals';

import { lastEventSignal } from '@/events/listening/lastEvent.js';
import type { EventName } from '@/events/types/events.js';
import type { SignalPayload } from '@/events/listening/types.js';

type CachedSignal<E extends EventName> = Signal<SignalPayload<E>>;
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
    cached = signal(undefined, {
      equals() {
        // We may receive several undefined in a row. For example,
        // in the main_button_pressed event.
        return false;
      },
    }) as Cache[E];
    lastEventSignal().sub(ev => {
      if (ev && ev[0] === event) {
        cached!.set(ev[1] as SignalPayload<E>);
      }
    });

    $eventSignalsCache.set({ ...$eventSignalsCache(), [event]: cached });
  }

  return cached as CachedSignal<E>;
}