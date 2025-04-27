import { is, looseObject, function as fn } from 'valibot';

import { logger } from '@/logger.js';
import { isIframe } from '@/env/isIframe.js';
import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
import { UnknownEnvError } from '@/errors.js';
import type {
  MethodName,
  MethodNameWithOptionalParams,
  MethodNameWithoutParams,
  MethodNameWithRequiredParams,
  MethodParams,
} from '@/methods/types/index.js';

import { postMessage } from './postMessage.js';
import { targetOrigin } from './targetOrigin.js';

export type PostEventFn = typeof postEvent;

/**
 * Calls Mini Apps methods requiring parameters.
 * @param method - method name.
 * @param params - options along with params.
 * @throws {UnknownEnvError} The environment is unknown.
 */
export function postEvent<Method extends MethodNameWithRequiredParams>(
  method: Method,
  params: MethodParams<Method>,
): void;

/**
 * Calls Mini Apps methods accepting no parameters at all.
 * @param method - method name.
 * @throws {UnknownEnvError} The environment is unknown.
 */
export function postEvent(method: MethodNameWithoutParams): void;

/**
 * Calls Mini Apps methods accepting optional parameters.
 * @param method - method name.
 * @param params - options along with params.
 * @throws {UnknownEnvError} The environment is unknown.
 */
export function postEvent<Method extends MethodNameWithOptionalParams>(
  method: Method,
  params?: MethodParams<Method>,
): void;

export function postEvent(
  eventType: MethodName,
  eventData?: MethodParams<MethodName>,
): void {
  logger().log('Posting event:', eventData ? { eventType, eventData } : { eventType });

  const w = window;

  const message = JSON.stringify({ eventType, eventData });

  // Telegram Web.
  if (isIframe()) {
    return postMessage(message, targetOrigin());
  }

  // Telegram for iOS, macOS, Android and Telegram Desktop.
  if (hasWebviewProxy(w)) {
    w.TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData));
    return;
  }

  // Telegram for Windows Phone or Android.
  if (is(looseObject({ external: looseObject({ notify: fn() }) }), w)) {
    w.external.notify(message);
    return;
  }

  // Otherwise, the current environment is unknown, and we are not able to send event.
  throw new UnknownEnvError();
}
