import type { If, IsNever } from '@telegram-apps/toolkit';
import type { SubscribeListenerFn } from '@telegram-apps/signals';

import type { EventName, EventPayload } from '@/events/types/index.js';
import type { LastEvent } from '@/events/listening/lastEvent.js';

/**
 * Event listener for specified event.
 */
export type EventListener<E extends EventName> = SubscribeListenerFn<SignalPayload<E>>;

export type SubscribeListener = SubscribeListenerFn<LastEvent | undefined>;

export type SignalPayload<E extends EventName> = If<
  IsNever<EventPayload<E>>,
  undefined,
  EventPayload<E>
>;
