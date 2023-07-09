/**
 * Emits event sent from Telegram native application like it was sent in
 * default web environment between 2 iframes. It dispatches new MessageEvent
 * and expects it to be handled via `window.addEventListener('message', ...)`
 * as developer would do it to handle messages sent from parent iframe.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
function emitTelegramEvent(eventType: string, eventData: unknown): void {
  window.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({ eventType, eventData }),
  }));
}

/**
 * Defines global event receiver, which handles events sent from native
 * Telegram application. As a result, this handler emits "message" event.
 */
export function defineEventsReceiver(): void {
  const wnd = window as any;

  // Iterate over each path, where "receiveEvent" function should be
  // defined. This function is called by external environment in case,
  // it wants to emit some event.
  [
    ['TelegramGameProxy_receiveEvent'], // Windows Phone.
    ['TelegramGameProxy', 'receiveEvent'], // Desktop.
    ['Telegram', 'WebView', 'receiveEvent'], // Android and iOS.
  ].forEach((path) => {
    // Path starts from "window" object.
    let pointer = wnd;

    path.forEach((item, idx, arr) => {
      // We are on the last iteration, where function property name is passed.
      if (idx === arr.length - 1) {
        pointer[item] = emitTelegramEvent;
        return;
      }

      if (!(item in pointer)) {
        pointer[item] = {};
      }
      pointer = pointer[item];
    });
  });
}
