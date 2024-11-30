import { emitMiniAppsEvent } from '@/events/emitMiniAppsEvent.js';

/**
 * Defines special handlers by known paths, which Telegram recognizes as ports to receive events.
 */
export function defineEventHandlers() {
  // Iterate over each path, where "receiveEvent" function should be
  // defined. This function is called by external environment in case,
  // it wants to emit some event.
  [
    ['TelegramGameProxy_receiveEvent'], // Windows Phone.
    ['TelegramGameProxy', 'receiveEvent'], // Desktop.
    ['Telegram', 'WebView', 'receiveEvent'], // Android and iOS.
  ].forEach((path) => {
    // Path starts from the "window" object.
    let pointer = window as Record<string, any>;

    path.forEach((item, idx, arr) => {
      // We are on the last iteration, where function property name is passed.
      if (idx === arr.length - 1) {
        pointer[item] = emitMiniAppsEvent;
        return;
      }

      if (!(item in pointer)) {
        pointer[item] = {};
      }
      pointer = pointer[item];
    });
  });
}
