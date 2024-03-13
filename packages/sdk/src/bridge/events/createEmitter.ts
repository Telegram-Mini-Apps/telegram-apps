import type { MiniAppsEventEmitter, MiniAppsEventName } from './events.js';
import { onTelegramEvent } from './onTelegramEvent.js';
import { clipboardTextReceived } from './parsers/clipboardTextReceived.js';
import { customMethodInvoked } from './parsers/customMethodInvoked.js';
import { invoiceClosed } from './parsers/invoiceClosed.js';
import { phoneRequested } from './parsers/phoneRequested.js';
import { popupClosed } from './parsers/popupClosed.js';
import { qrTextReceived } from './parsers/qrTextReceived.js';
import { themeChanged } from './parsers/theme-changed.js';
import { viewportChanged } from './parsers/viewportChanged.js';
import { writeAccessRequested } from './parsers/writeAccessRequested.js';
import { EventEmitter } from '../../event-emitter/EventEmitter.js';
import { logger } from '../../globals.js';
import { string } from '../../parsing/parsers/string.js';

/**
 * Returns event emitter which could be safely used, to process events from
 * Telegram native application.
 */
export function createEmitter(): MiniAppsEventEmitter {
  const emitter: MiniAppsEventEmitter = new EventEmitter();
  const emit: MiniAppsEventEmitter['emit'] = (event: any, ...data: any[]) => {
    logger.log('Emitting processed event:', event, ...data);
    emitter.emit(event, ...data);
  };

  // Desktop version of Telegram is sometimes not sending the viewport_changed
  // event. For example, when main button is shown. That's why we should
  // add our own listener to make sure, viewport information is always fresh.
  // Issue: https://github.com/Telegram-Mini-Apps/tma.js/issues/10
  window.addEventListener('resize', () => {
    emit('viewport_changed', {
      width: window.innerWidth,
      height: window.innerHeight,
      is_state_stable: true,
      is_expanded: true,
    });
  });

  // In case, any Telegram event was received, we should prepare data before
  // passing it to emitter.
  onTelegramEvent((eventType: MiniAppsEventName | string, eventData): void => {
    logger.log('Received raw event:', eventType, eventData);

    try {
      switch (eventType) {
        case 'viewport_changed':
          return emit(eventType, viewportChanged().parse(eventData));

        case 'theme_changed':
          return emit(eventType, themeChanged().parse(eventData));

        case 'popup_closed':
          // FIXME: Payloads are different on different platforms.
          //  Issue: https://github.com/Telegram-Mini-Apps/tma.js/issues/2
          if (
            // Sent on desktop.
            eventData === undefined
            // Sent on iOS.
            || eventData === null
          ) {
            return emit(eventType, {});
          }
          return emit(eventType, popupClosed().parse(eventData));

        case 'set_custom_style':
          return emit(eventType, string().parse(eventData));

        case 'qr_text_received':
          return emit(eventType, qrTextReceived().parse(eventData));

        case 'clipboard_text_received':
          return emit(eventType, clipboardTextReceived().parse(eventData));

        case 'invoice_closed':
          return emit(eventType, invoiceClosed().parse(eventData));

        case 'phone_requested':
          return emit('phone_requested', phoneRequested().parse(eventData));

        case 'custom_method_invoked':
          return emit('custom_method_invoked', customMethodInvoked().parse(eventData));

        case 'write_access_requested':
          return emit('write_access_requested', writeAccessRequested().parse(eventData));

        // Events which have no parameters.
        case 'main_button_pressed':
        case 'back_button_pressed':
        case 'settings_button_pressed':
        case 'scan_qr_popup_closed':
        case 'reload_iframe':
          return emit(eventType);

        // All other event listeners will receive unknown type of data.
        default:
          return emit(eventType as any, eventData);
      }
    } catch (cause) {
      logger.error('Error processing event:', cause);
    }
  });

  return emitter;
}
