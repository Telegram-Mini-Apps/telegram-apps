import { looseObject, function as fn, is } from 'valibot';

/**
 * Returns true in case, passed value contains path `TelegramWebviewProxy.postEvent` property and
 * `postEvent` is a function.
 * @param value - value to check.
 */
export function hasWebviewProxy<T>(value: T): value is T & {
  TelegramWebviewProxy: {
    postEvent: (...args: unknown[]) => unknown;
  };
} {
  return is(
    looseObject({ TelegramWebviewProxy: looseObject({ postEvent: fn() }) }),
    value,
  );
}
