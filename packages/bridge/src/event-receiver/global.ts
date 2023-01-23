import {createJsonParser, EventEmitter, isRecord, log} from '@twa.js/utils';
import {ViewportChangedPayload} from '../events';

interface GlobalEventEmitterEventsMap {
  /**
   * Event, emitted by external environment.
   * @param event - event name.
   * @param data - event payload.
   */
  message: (event: string, data: unknown) => void;
}

/**
 * Represents global event emitter which handles window "message" event and
 * emits new event with prepared data.
 */
type GlobalEventEmitter = EventEmitter<GlobalEventEmitterEventsMap>;

/**
 * Represents global event emitter. Once created, it can be reused by
 * `getGlobalEventEmitter` function.
 * @see getGlobalEventEmitter
 */
let eventEmitter: GlobalEventEmitter | undefined;

/**
 * Extracts event data from native application event.
 */
const parseMessageEventData = createJsonParser({
  eventType: 'string',
  eventData: {type: value => value, optional: true},
});

/**
 * Returns singleton version of GlobalEventEmitter.
 */
function getGlobalEventEmitter(debug = false): GlobalEventEmitter {
  if (eventEmitter === undefined) {
    // Create global event emitter.
    const emitter = new EventEmitter<GlobalEventEmitterEventsMap>();

    // Define function to log messages.
    const logMessage: typeof log = (level, ...args) => {
      if (debug) {
        log(level, '[Bridge]', ...args);
      }
    };

    // Add "message" event listener.
    window.addEventListener('message', (event: MessageEvent | CustomEvent) => {
      logMessage('log', 'message event received', event);
      let evData: unknown;

      // We expect receiving message event from parent iframe.
      if (event instanceof MessageEvent) {
        if (event.source !== window.parent || typeof event.data !== 'string') {
          return logMessage('log', 'event rejected', event);
        }
        evData = event.data;
      } else if (
        event instanceof CustomEvent &&
        isRecord(event.detail) &&
        typeof event.detail.eventType === 'string' &&
        'eventData' in event.detail
      ) {
        // In case, global receiveEvent function was installed, we could receive
        // event of CustomEvent type.
        evData = event.detail;
      } else {
        return logMessage('warn', 'event was skipped', event);
      }

      let type: string;
      let data: unknown;
      try {
        const {eventType, eventData} = parseMessageEventData(evData);
        type = eventType;
        data = eventData;
      } catch (e) {
        return logMessage('error', 'event data extraction error', evData, e);
      }
      emitter.emit('message', type, data);
    });

    // Desktop version of Telegram sometimes not sending viewport_changed
    // event. For example, when main button is shown. That's why we should
    // add out own listener to be sure, viewport information is always fresh.
    // Issue: https://github.com/Telegram-Web-Apps/twa/issues/10
    window.addEventListener('resize', () => {
      const payload: ViewportChangedPayload = {
        width: window.innerWidth,
        height: window.innerHeight,
        is_state_stable: true,
        is_expanded: true,
      };
      emitter.emit('message', 'viewport_changed', payload);
    });

    eventEmitter = emitter;
  }
  return eventEmitter;
}

export {GlobalEventEmitterEventsMap, GlobalEventEmitter, getGlobalEventEmitter};