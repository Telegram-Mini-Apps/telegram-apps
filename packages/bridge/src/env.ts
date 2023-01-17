/**
 * Object, created by Telegram desktop or mobile applications, which allows
 * usage of events. As it was noticed, in case, when call of some event is
 * required, native application inserts JavaScript code as following:
 *
 * ```javascript
 * window.TelegramWebviewProxy.postEvent(event, data);
 * ```
 */
type WithTelegramWebviewProxy<T> = T & {
  TelegramWebviewProxy: {
    postEvent(event: string, data: string): void;
  };
}

/**
 * Object, created by Telegram Windows Phone application, which allows usage of
 * events. As it was noticed, in case, when call of some event is required,
 * native application inserts JavaScript code as following:
 *
 * ```javascript
 * window.external.notify(data);
 * ```
 */
type WithExternalNotify<T> = T & {
  external: {
    notify(data: string): void;
  };
}

/**
 * Returns true, in case passed value contains property, which is responsible
 * for receiving events on desktop version of Telegram.
 * @param wnd - Window object.
 */
function hasTelegramWebviewProxy<W extends Window>(
  wnd: W,
): wnd is WithTelegramWebviewProxy<W> {
  return (wnd as any).TelegramWebviewProxy !== undefined;
}

/**
 * Returns true, in case passed value contains property, which is responsible
 * for receiving events on desktop version of Telegram.
 * @param wnd - Window object.
 */
function hasExternalNotify<W extends Window>(
  wnd: W,
): wnd is WithExternalNotify<W> {
  return 'external' in wnd && typeof (wnd.external as any).notify === 'function';
}

/**
 * Returns true in case, current environment is iframe.
 * @see https://stackoverflow.com/a/326076
 */
function isBrowserEnv(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export {
  isBrowserEnv,
  hasTelegramWebviewProxy,
  WithTelegramWebviewProxy,
  WithExternalNotify,
  hasExternalNotify,
};
