import type { MiniAppsEventListener, MiniAppsEventName } from './events.js';
import { off } from './off.js';
import { singletonEmitter } from './singletonEmitter.js';

type StopListening = () => void;

/**
 * Works the same as "on" method, but after catching the event, will remove event listener.
 * @param event - event name.
 * @param listener - event listener.
 */
export function once<E extends MiniAppsEventName>(
  event: E,
  listener: MiniAppsEventListener<E>,
): StopListening {
  singletonEmitter().once(event, listener);
  return () => off(event, listener);
}
