import { EventEmitter, createJsonParser } from '@twa.js/utils';

import type { ViewportChangedPayload } from './listening/index.js';

export interface EventsObserverEventsMap {
  /**
   * Event, emitted by Telegram native application.
   * @param eventType - event name.
   * @param eventData - event payload.
   */
  message: (eventType: string, eventData: unknown) => void;
}

/**
 * Represents global event emitter which handles window "message" event and
 * emits new event with prepared data.
 */
export type EventsObserver = EventEmitter<EventsObserverEventsMap>;

/**
 * Extracts event data from native application event.
 */
const parseMessageEventData = createJsonParser({
  eventType: 'string',
  eventData: { type: (value) => value, optional: true },
});

/**
 * Returns event emitter which is listening to window "message" events, extracts
 * their data assuming they are Telegram native application events and emits
 * them by itself.
 */
export function createEventsObserver(): EventsObserver {
  const emitter: EventsObserver = new EventEmitter();

  // We could receive "message" events in case they were sent from Telegram
  // native application.
  window.addEventListener('message', (event) => {
    try {
      const { eventType, eventData } = parseMessageEventData(event.data);
      emitter.emit('message', eventType, eventData);
    } catch {
      // We ignore incorrect messages as long as they could be generated
      // by anyone and there is no warranty, it was sent from Telegram.
    }
  });

  // Desktop version of Telegram is sometimes not sending the viewport_changed
  // event. For example, when main button is shown. That's why we should
  // add our own listener to make sure, viewport information is always fresh.
  // Issue: https://github.com/Telegram-Web-Apps/twa.js/issues/10
  window.addEventListener('resize', () => {
    const payload: ViewportChangedPayload = {
      width: window.innerWidth,
      height: window.innerHeight,
      is_state_stable: true,
      is_expanded: true,
    };
    emitter.emit('message', 'viewport_changed', payload);
  });

  return emitter;
}
