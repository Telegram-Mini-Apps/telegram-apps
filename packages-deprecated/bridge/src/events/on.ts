import { singletonEmitter } from './emitter.js';
import { off } from './off.js';

import type { EventName, EventListener } from './events.js';

type StopListening = () => void;

/**
 * Adds new listener to the specified event. Returns handler
 * which allows to stop listening to event.
 * @param event - event name.
 * @param listener - event listener.
 */
export function on<E extends EventName>(event: E, listener: EventListener<E>): StopListening {
  singletonEmitter().on(event, listener);
  return () => off(event, listener);
}
