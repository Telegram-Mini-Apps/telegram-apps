import { isRecord } from '@telegram-apps/transformers';

/**
 * Returns true in case, passed value contains path `TelegramWebviewProxy.postEvent` property and
 * `postEvent` is a function.
 * @param value - value to check.
 */
export function hasWebviewProxy<T extends {}>(value: T): value is (
  T & {
  TelegramWebviewProxy: {
    postEvent: (...args: unknown[]) => unknown;
  }
}) {
  if (isRecord(value)) {
    const { TelegramWebviewProxy } = value as Record<string, unknown>;
    return isRecord(TelegramWebviewProxy)
      && typeof TelegramWebviewProxy.postEvent === 'function';
  }
  return false;
}
