import {useEffect, useMemo} from 'react';

import {useForceUpdate} from './useForceUpdate';

/**
 * Minimal set of properties, which is required by hook.
 */
interface Trackable {
  on: (event: any, ...args: any[]) => void;
  off: (event: any, ...args: any[]) => void;
}

/**
 * Returns type trackable event names.
 */
type EventName<T extends Trackable> = T extends {
  on(event: infer E, ...args: any[]): any
} ? E : never;

/**
 * Hooks which listens to specified object events and calls force update
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
  const memoizedEvents = useMemo(() => events, []);

  memoizedEvents.forEach(event => {
    useEffect(() => {
      trackable.on(event, forceUpdate);
      return () => trackable.off(event, forceUpdate);
    }, [trackable, forceUpdate]);
  });
}