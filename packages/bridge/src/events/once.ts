import { singletonEmitter } from './emitter.js';
import { off } from './off.js';

import type { EventName, EventListener } from './events.js';

type StopListening = () => void;

/**
 * Works the same as "on" method, but after catching the event, will remove event listener.
 * @param event - event name.
 * @param listener - event listener.
 */
export function once<E extends EventName>(event: E, listener: EventListener<E>): StopListening {
  singletonEmitter().once(event, listener);
  return () => off(event, listener);
}
