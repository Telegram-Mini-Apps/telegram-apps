import type { Events60 } from './6.0.js';
import type { Events61 } from './6.1.js';
import type { Events64 } from './6.4.js';
import type { Events69 } from './6.9.js';
import type { Events72 } from './7.2.js';

/**
 * Map where key is known event name, and value is its listener.
 * @see https://docs.telegram-mini-apps.com/platform/events
 */
export interface Events extends Events60, Events61, Events64, Events69, Events72 {
}

/**
 * Mini Apps event name.
 */
export type EventName = keyof Events;

/**
 * Payload of the specified Mini Apps event.
 */
export type EventPayload<E extends EventName> = Events[E];
