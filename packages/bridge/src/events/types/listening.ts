import type { Handler } from 'mitt';

import type { EventName, EventPayload, Events } from '@/events/types/index.js';
import type { WildcardHandler } from '@/events/createEmitter.js';

export type EventListener<E extends EventName> = Handler<EventPayload<E>>;

export type SubscribeListener = WildcardHandler<Events>;
