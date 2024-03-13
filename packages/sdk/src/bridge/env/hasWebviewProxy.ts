import { isRecord } from '../../misc/index.js';

type WithWebviewProxy<T> = T & {
  TelegramWebviewProxy: {
    postEvent: (...args: any) => any;
  }
};

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
