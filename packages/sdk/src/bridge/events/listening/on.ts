import type { RemoveEventListenerFn } from '@/events/types.js';

import { miniAppsEventEmitter } from '../event-emitter/singleton.js';
import { off } from '../listening/off.js';
import type { MiniAppsEventListener, MiniAppsEventName } from '../types.js';

/**
 * Adds new listener to the specified event. Returns handler
 * which allows to stop listening to event.
 * @param event - event name.
 * @param listener - event listener.
 * @param once - should listener be called only once.
 * @returns Function to remove bound event listener.
 */
export function on<E extends MiniAppsEventName>(
  event: E,
  listener: MiniAppsEventListener<E>,
  once?: boolean,
): RemoveEventListenerFn {
  const wired: MiniAppsEventListener<E> = (...args) => {
    listener(...args);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    once && remove();
  };
  const remove = () => off(event, wired);

  miniAppsEventEmitter().on(event, wired);
  return remove;
}
