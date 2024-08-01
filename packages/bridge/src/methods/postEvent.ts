import { log } from '@/debug.js';
import { isIframe } from '@/env/isIframe.js';
import { isRecord } from '@/utils/isRecord.js';
import { createError } from '@/errors/createError.js';
import { ERR_UNKNOWN_ENV } from '@/errors/errors.js';
import { targetOrigin } from '@/methods/targetOrigin.js';
import type {
  MethodName,
  MethodNameWithOptionalParams,
  MethodNameWithoutParams,
  MethodNameWithRequiredParams,
  MethodParams,
} from '@/methods/types/index.js';
import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';

interface PostEventOptions {
  /**
   * Origin used while posting a message.
   *
   * This option is only used if the current environment is browser (Web version of Telegram)
   * and could be used for test purposes.
   * @default 'https://web.telegram.org'
   */
  targetOrigin?: string;
}

export type PostEvent = typeof postEvent;

/**
 * Calls Mini Apps methods requiring parameters.
 * @param method - method name.
 * @param params - method parameters.
 * @param options - posting options.
 * @throws {BridgeError} ERR_UNKNOWN_ENV
 * @see ERR_UNKNOWN_ENV
 */
export function postEvent<Method extends MethodNameWithRequiredParams>(
  method: Method,
  params: MethodParams<Method>,
  options?: PostEventOptions,
): void;

/**
 * Calls Mini Apps methods accepting optional parameters.
 * @param method - method name.
 * @param params - method parameters.
 * @param options - posting options.
 * @throws {BridgeError} ERR_UNKNOWN_ENV
 * @see ERR_UNKNOWN_ENV
 */
export function postEvent<Method extends MethodNameWithOptionalParams>(
  method: Method,
  params?: MethodParams<Method>,
  options?: PostEventOptions,
): void;

/**
 * Calls Mini Apps methods accepting optional or no parameters at all.
 * @param method - method name.
 * @param options - posting options.
 * @throws {BridgeError} ERR_UNKNOWN_ENV
 * @see ERR_UNKNOWN_ENV
 */
export function postEvent(
  method: MethodNameWithoutParams | MethodNameWithOptionalParams,
  options?: PostEventOptions,
): void;

export function postEvent(
  eventType: MethodName,
  paramsOrOptions?: MethodParams<MethodName> | PostEventOptions,
  options?: PostEventOptions,
): void {
  let postOptions: PostEventOptions = {};
  let eventData: any;

  if (!paramsOrOptions && !options) {
    // Parameters and options were not passed.
    postOptions = {};
  } else if (paramsOrOptions && options) {
    // Both parameters and options passed.
    postOptions = options;
    eventData = paramsOrOptions;
  } else if (paramsOrOptions) {
    // Only parameters were passed.
    if ('targetOrigin' in paramsOrOptions) {
      postOptions = paramsOrOptions;
    } else {
      eventData = paramsOrOptions;
    }
  }

  log('Posting event:', eventData
    ? { event: eventType, data: eventData }
    : { event: eventType });

  // Telegram Web.
  if (isIframe()) {
    return window.parent.postMessage(
      JSON.stringify({ eventType, eventData }),
      postOptions.targetOrigin || targetOrigin(),
    );
  }

  // Telegram for Windows Phone or Android.
  if (hasExternalNotify(window)) {
    window.external.notify(JSON.stringify({ eventType, eventData }));
    return;
  }

  // Telegram for iOS and macOS.
  if (hasWebviewProxy(window)) {
    window.TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData));
    return;
  }

  // Otherwise current environment is unknown, and we are not able to send event.
  throw createError(ERR_UNKNOWN_ENV);
}
