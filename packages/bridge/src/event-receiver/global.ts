import {EventEmitter, isRecord, log} from 'twa-core';
import {extractMessageEventData} from '../parsing';
import {WindowGlobalEventEmitter} from './constants';
import {ViewportChangedPayload} from '../events';

export interface GlobalEventEmitterEventsMap {
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
export type GlobalEventEmitter = EventEmitter<GlobalEventEmitterEventsMap>;

/**
 * Returns singleton version of GlobalEventEmitter.
 */
export function getGlobalEventEmitter(debug = false): GlobalEventEmitter {
  const wnd = window as any;

  // Return cached version of emitter.
  if (wnd[WindowGlobalEventEmitter] !== undefined) {
    return wnd[WindowGlobalEventEmitter];
  }
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

    try {
      const {type, data} = extractMessageEventData(evData);
      emitter.emit('message', type, data);
    } catch (e) {
      logMessage('error', 'event data extraction error', evData, e);
    }
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

  wnd[WindowGlobalEventEmitter] = emitter;
  return emitter;
}