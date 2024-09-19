import { fn, object } from '@telegram-apps/transformers';
import { TypedError } from '@telegram-apps/toolkit';

import { logInfo } from '@/debug.js';
import { isIframe } from '@/env/isIframe.js';
import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
import { ERR_UNKNOWN_ENV } from '@/errors.js';
import { $targetOrigin } from '@/methods/$targetOrigin.js';
import type {
  MethodName,
  MethodNameWithOptionalParams,
  MethodNameWithoutParams,
  MethodNameWithRequiredParams,
  MethodParams,
} from '@/methods/types/index.js';

export type PostEventFn = typeof postEvent;

/**
 * Calls Mini Apps methods requiring parameters.
 * @param method - method name.
 * @param params - options along with params.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 */
export function postEvent<Method extends MethodNameWithRequiredParams>(
  method: Method,
  params: MethodParams<Method>,
): void;

/**
 * Calls Mini Apps methods accepting no parameters at all.
 * @param method - method name.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 */
export function postEvent(method: MethodNameWithoutParams): void;

/**
 * Calls Mini Apps methods accepting optional parameters.
 * @param method - method name.
 * @param params - options along with params.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 */
export function postEvent<Method extends MethodNameWithOptionalParams>(
  method: Method,
  params?: MethodParams<Method>,
): void;

export function postEvent(
  eventType: MethodName,
  eventData?: MethodParams<MethodName>,
): void {
  logInfo('Posting event:', eventData ? { eventType, eventData } : { eventType });

  const w = window;

  // Telegram for iOS and macOS.
  if (hasWebviewProxy(w)) {
    w.TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData));
    return;
  }

  const message = JSON.stringify({ eventType, eventData });

  // Telegram Web.
  if (isIframe()) {
    return w.parent.postMessage(message, $targetOrigin());
  }

  // Telegram for Windows Phone or Android.
  const { external } = w;
  if (object({ notify: fn() })().isValid(external)) {
    external.notify(message);
    return;
  }

  // Otherwise current environment is unknown, and we are not able to send event.
  throw new TypedError(ERR_UNKNOWN_ENV);
}
