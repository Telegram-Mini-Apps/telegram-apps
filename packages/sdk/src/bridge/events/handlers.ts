/**
 * Emits event sent from Telegram native application like it was sent in
 * default web environment between 2 iframes. It dispatches new MessageEvent
 * and expects it to be handled via `window.addEventListener('message', ...)`
 * as developer would do it to handle messages sent from the parent iframe.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
export function emitMiniAppsEvent(eventType: string, eventData: unknown): void {
  window.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({ eventType, eventData }),
    // We specify window.parent to imitate the case, the parent iframe sent us this event.
    source: window.parent,
  }));
}

/**
 * Removes global event handlers, used by the package.
 */
export function removeEventHandlers(): void {
  ['TelegramGameProxy_receiveEvent', 'TelegramGameProxy', 'Telegram'].forEach((prop) => {
    delete window[prop as keyof Window];
  });
}

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
