import { off } from './off.js';
import { singletonEmitter } from './singletonEmitter.js';
import type { MiniAppsEventListener, MiniAppsEventName } from './types/events.js';
import type { CleanupFn } from '../../types/misc.js';

/**
 * Works the same as "on" method, but after catching the event, will remove event listener.
 * @param event - event name.
 * @param listener - event listener.
 */
export function once<E extends MiniAppsEventName>(
  event: E,
  listener: MiniAppsEventListener<E>,
): CleanupFn {
  singletonEmitter().once(event, listener);
  return () => off(event, listener);
}
