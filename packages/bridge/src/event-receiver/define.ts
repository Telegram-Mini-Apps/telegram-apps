/**
 * States, that receiver was defined before.
 */
let receiverDefined = false;

/**
 * Defines global event receiver, which handles events sent from native
 * Telegram application. As a result, this handler emits "message" event.
 */
function defineEventReceiver(force = false): void {
  if (receiverDefined && !force) {
    return;
  }
  const wnd = window as any;

  // Iterate over each path, where "receiveEvent" function should be
  // defined. This function is called by external environment in case,
  // it wants to emit some event.
  [
    ['TelegramGameProxy_receiveEvent'], // Windows Phone.
    ['TelegramGameProxy', 'receiveEvent'], // Desktop.
    ['Telegram', 'WebView', 'receiveEvent'], // Android and iOS.
  ].forEach(path => {
    // Path starts from "window" object.
    let pointer = wnd;

    path.forEach((item, idx, arr) => {
      // We are on the last iteration, where function property name is passed.
      if (idx === arr.length - 1) {
        // Here we define our custom receive event function which just emits
        // new custom event in window. We assume, that there is some event
        // listener which uses classic way of handling events from one iframe
        // to another - `window.postEvent` to send
        // and `window.addEventListener('message')` to receive.
        pointer[item] = (eventType: string, eventData: unknown): void => {
          window.dispatchEvent(
            new CustomEvent('message', {detail: {eventType, eventData}}),
          );
        };
        return;
      }

      if (!(item in pointer)) {
        pointer[item] = {};
      }
      pointer = pointer[item];
    });
  });

  // To prevent another receiver installation, set flag.
  receiverDefined = true;
}

export {defineEventReceiver};