import type { If, IsNever } from '@telegram-apps/toolkit';
import type { SubscribeListenerFn } from '@telegram-apps/signals';

import { EventName, type EventPayload } from '@/events/types/index.js';

/**
 * Event listener for specified event.
 */
export type EventListener<E extends EventName> = SubscribeListenerFn<
  SignalPayload<E>,
  SignalPayload<E> | undefined
>;

export type SignalPayload<E extends EventName> = If<
  IsNever<EventPayload<E>>,
  undefined,
  EventPayload<E>
>;
