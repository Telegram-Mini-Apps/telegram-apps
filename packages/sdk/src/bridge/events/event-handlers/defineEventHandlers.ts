import { emitMiniAppsEvent } from './emitMiniAppsEvent.js';

/**
 * Defines special handlers by known paths, which are recognized by
 * Telegram as ports to receive events. This function also sets special
 * function in global window object to prevent duplicate declaration.
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
    let pointer = window as any;

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
