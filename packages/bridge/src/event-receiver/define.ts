import {CustomEventDetail} from './types';
import {WindowReceiverDefined} from './constants';

/**
 * Defines global event receiver, which handles events sent from native
 * Telegram application. As a result, this handler emits "message" event.
 */
export function defineEventReceiver(): void {
  const wnd = window as any;

  // We expect installing event receiver only once.
  if (wnd[WindowReceiverDefined]) {
    return;
  }

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
            new CustomEvent<CustomEventDetail>('message', {
              detail: {eventType, eventData},
            }),
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
  wnd[WindowReceiverDefined] = true;
}
