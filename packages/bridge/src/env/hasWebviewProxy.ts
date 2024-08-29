import { object, fn } from '@telegram-apps/transformers';

interface WithWebviewProxy {
  TelegramWebviewProxy: {
    postEvent: (...args: unknown[]) => unknown;
  };
}

const webViewProxy = object<WithWebviewProxy>({
  TelegramWebviewProxy: object({ postEvent: fn() })(),
});

/**
 * Returns true in case, passed value contains path `TelegramWebviewProxy.postEvent` property and
 * `postEvent` is a function.
 * @param value - value to check.
 */
export function hasWebviewProxy<T>(value: T): value is T & WithWebviewProxy {
  return webViewProxy().isValid(value);
}
