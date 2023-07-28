import type { EventName, EventListener } from './events.js';
import { singletonEmitter } from './emitter.js';

/**
 * Removes listener from specified event.
 * @param event - event to listen.
 * @param listener - event listener.
 */
export function off<E extends EventName>(event: E, listener: EventListener<E>): void {
  singletonEmitter().off(event, listener);
}
