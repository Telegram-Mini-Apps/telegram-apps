import { isRecord } from '@/misc/isRecord.js';

/**
 * Returns true in case, passed value contains path `TelegramWebviewProxy.postEvent` property and
 * `postEvent` is a function.
 * @param value - value to check.
 */
export function hasWebviewProxy<T extends {}>(value: T): value is (
  T & {
  TelegramWebviewProxy: {
    postEvent: (...args: any) => any;
  }
}) {
  return 'TelegramWebviewProxy' in value
    && isRecord(value.TelegramWebviewProxy)
    && 'postEvent' in value.TelegramWebviewProxy
    && typeof value.TelegramWebviewProxy.postEvent === 'function';
}
