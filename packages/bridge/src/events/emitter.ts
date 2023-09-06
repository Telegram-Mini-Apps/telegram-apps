import { EventEmitter as UtilEventEmitter } from '@twa.js/utils';
import { string } from '@twa.js/parsing';

import { log } from '../globals.js';
import {
  clipboardTextReceivedPayload,
  customMethodInvokedPayload,
  invoiceClosedPayload,
  phoneRequestedPayload,
  popupClosedPayload,
  qrTextReceivedPayload,
  themeChangedPayload,
  viewportChangedPayload,
  writeAccessRequestedPayload,
} from './parsing.js';
import { onTelegramEvent } from './onTelegramEvent.js';

import type { EventEmitter, EventName } from './events.js';

const CACHED_EMITTER = '__telegram-cached-emitter__';

/**
 * Returns event emitter which could be safely used, to process events from
 * Telegram native application.
 */
export function createEmitter(): EventEmitter {
  const emitter: EventEmitter = new UtilEventEmitter();
  const emit: EventEmitter['emit'] = (event: any, ...data: any[]) => {
    log('log', 'Emitting processed event:', event, ...data);
    emitter.emit(event, ...data);
  };

  // Desktop version of Telegram is sometimes not sending the viewport_changed
  // event. For example, when main button is shown. That's why we should
  // add our own listener to make sure, viewport information is always fresh.
  // Issue: https://github.com/Telegram-Web-Apps/twa.js/issues/10
  window.addEventListener('resize', () => {
    emitter.emit('viewport_changed', {
      width: window.innerWidth,
      height: window.innerHeight,
      is_state_stable: true,
      is_expanded: true,
    });
  });

  // In case, any Telegram event was received, we should prepare data before
  // passing it to emitter.
  onTelegramEvent((eventType: EventName | string, eventData): void => {
    log('log', 'Received raw event:', eventType, eventData);

    try {
      switch (eventType) {
        case 'viewport_changed':
          return emit(eventType, viewportChangedPayload.parse(eventData));

        case 'theme_changed':
          return emit(eventType, themeChangedPayload.parse(eventData));

        case 'popup_closed':
          // FIXME: Payloads are different on different platforms.
          //  Issue: https://github.com/Telegram-Web-Apps/twa.js/issues/2
          if (
            // Sent on desktop.
            eventData === undefined
            // Sent on iOS.
            || eventData === null
          ) {
            return emit(eventType, {});
          }
          return emit(eventType, popupClosedPayload.parse(eventData));

        case 'set_custom_style':
          return emit(eventType, string().parse(eventData));

        case 'qr_text_received':
          return emit(eventType, qrTextReceivedPayload.parse(eventData));

        case 'clipboard_text_received':
          return emit(eventType, clipboardTextReceivedPayload.parse(eventData));

        case 'invoice_closed':
          return emit(eventType, invoiceClosedPayload.parse(eventData));

        case 'phone_requested':
          return emit('phone_requested', phoneRequestedPayload.parse(eventData));

        case 'custom_method_invoked':
          return emit('custom_method_invoked', customMethodInvokedPayload.parse(eventData));

        case 'write_access_requested':
          return emit('write_access_requested', writeAccessRequestedPayload.parse(eventData));

        // Events which have no parameters.
        case 'main_button_pressed':
        case 'back_button_pressed':
        case 'settings_button_pressed':
        case 'scan_qr_popup_closed':
          return emit(eventType);

        // All other event listeners will receive unknown type of data.
        default:
          return emit(eventType as any, eventData);
      }
    } catch (cause) {
      log('error', 'Error processing event:', cause);
    }
  });

  return emitter;
}

/**
 * Returns singleton instance of bridge EventEmitter. Also, defines
 * Telegram event handlers.
 */
export function singletonEmitter(): EventEmitter {
  const wnd: any = window;
  const cachedEmitter = wnd[CACHED_EMITTER];

  if (cachedEmitter === undefined) {
    wnd[CACHED_EMITTER] = createEmitter();
  }

  return wnd[CACHED_EMITTER];
}
