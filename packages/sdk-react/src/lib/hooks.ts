import { useCallback, useState, useEffect } from 'react';
import type { PostEvent } from '@tma.js/sdk';

import { useUnit } from '../provider/index.js';

interface Trackable {
  on: (event: any, ...args: any[]) => void;
  off: (event: any, ...args: any[]) => void;
}

type EventName<T extends Trackable> = T extends {
  on(event: infer E, ...args: any[]): any
} ? E : never;

/**
 * The hook which returns function used for force update.
 */
export function useForceUpdate(): (() => void) {
  const [, setHash] = useState(0);
  // TODO: Maybe just assign new symbol?
  return useCallback(() => setHash((hash) => (hash + 1) % 1_000_000), []);
}

/**
 * The hook which listens to the specified object events and calls force update
 * in case, some of them was emitted.
 * @param trackable - object which allows events listening.
 * @param events - events to listen. This array will be memoized during first
 * hook call.
 */
export function useEventsTracking<T extends Trackable>(
  trackable: T,
  events: EventName<T>[],
) {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    // Start listening to each event.
    events.forEach((event) => trackable.on(event, forceUpdate));

    // On cleanup remove event listeners.
    return () => events.forEach((event) => trackable.off(event, forceUpdate));
  }, [trackable, forceUpdate, events]);
}

/**
 * Returns event posting function which was created during SDK
 * initialization.
 */
export function usePostEvent(): PostEvent {
  return useUnit('postEvent');
}
