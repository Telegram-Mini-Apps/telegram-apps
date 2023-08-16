import { isRecord } from '@twa.js/utils';

type AnyFunc = (...args: unknown[]) => unknown;

type WithExternalNotify<T> = T & {
  external: { notify: AnyFunc }
};

type WithWebviewProxy<T> = T & {
  TelegramWebviewProxy: {
    postEvent: AnyFunc;
  }
};

/**
 * Returns true in case, passed value contains path `external.notify` property and `notify` is a
 * function.
 * @param value - value to check.
 */
export function hasExternalNotify<T extends {}>(value: T): value is WithExternalNotify<T> {
  return 'external' in value
    && isRecord(value.external)
    && 'notify' in value.external
    && typeof value.external.notify === 'function';
}

/**
 * Returns true in case, passed value contains path `TelegramWebviewProxy.postEvent` property and
 * `postEvent` is a function.
 * @param value - value to check.
 */
export function hasWebviewProxy<T extends {}>(value: T): value is WithWebviewProxy<T> {
  return 'TelegramWebviewProxy' in value
    && isRecord(value.TelegramWebviewProxy)
    && 'postEvent' in value.TelegramWebviewProxy
    && typeof value.TelegramWebviewProxy.postEvent === 'function';
}

/**
 * Returns true in case, current environment is iframe.
 * @see https://stackoverflow.com/a/326076
 */
export function isIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export function isTelegramWeb
