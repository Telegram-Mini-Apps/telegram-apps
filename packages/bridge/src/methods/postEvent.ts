import { isRecord } from '@telegram-apps/transformers';

import { debugLog } from '@/debug.js';
import { isIframe } from '@/env/isIframe.js';
import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
import { ERR_UNKNOWN_ENV } from '@/errors/errors.js';
import { BridgeError } from '@/errors/BridgeError.js';
import { targetOrigin } from '@/methods/targetOrigin.js';
import type {
  MethodName,
  MethodNameWithOptionalParams,
  MethodNameWithoutParams,
  MethodNameWithRequiredParams,
  MethodParams,
} from '@/methods/types/index.js';

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

export interface PostEvent {
  /**
   * Calls Mini Apps methods requiring parameters.
   * @param method - method name.
   * @param paramsAndOptions - options along with params.
   * @throws {BridgeError} ERR_UNKNOWN_ENV
   * @see ERR_UNKNOWN_ENV
   */<Method extends MethodNameWithRequiredParams>(
    method: Method,
    paramsAndOptions: MethodParams<Method> & PostEventOptions,
  ): void;

  /**
   * Calls Mini Apps methods accepting no parameters at all.
   * @param method - method name.
   * @param options - posting options.
   * @throws {BridgeError} ERR_UNKNOWN_ENV
   * @see ERR_UNKNOWN_ENV
   */
  (method: MethodNameWithoutParams, options?: PostEventOptions): void;

  /**
   * Calls Mini Apps methods accepting optional parameters.
   * @param method - method name.
   * @param paramsAndOptions - options along with params.
   * @throws {BridgeError} ERR_UNKNOWN_ENV
   * @see ERR_UNKNOWN_ENV
   */<Method extends MethodNameWithOptionalParams>(
    method: Method,
    paramsAndOptions?: MethodParams<Method> & PostEventOptions,
  ): void;
}

export const postEvent: PostEvent = (
  eventType: MethodName,
  optionsOrParamsAndOptions?: PostEventOptions | (MethodParams<MethodName> & PostEventOptions),
): void => {
  optionsOrParamsAndOptions ||= {};
  let eventData: any;
  let origin: string | undefined;
  if ('targetOrigin' in optionsOrParamsAndOptions) {
    const { targetOrigin, ...rest } = optionsOrParamsAndOptions;
    eventData = rest;
    origin = targetOrigin;
  } else {
    eventData = optionsOrParamsAndOptions;
  }

  debugLog('Posting event:', eventData
    ? { event: eventType, data: eventData }
    : { event: eventType });

  // Telegram for iOS and macOS.
  if (hasWebviewProxy(window)) {
    window.TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData));
    return;
  }

  const message = JSON.stringify({ eventType, eventData });

  // Telegram Web.
  if (isIframe()) {
    return window.parent.postMessage(message, origin || targetOrigin());
  }

  // Telegram for Windows Phone or Android.
  const { external } = window;
  if (isRecord(external) && typeof external.notify === 'function') {
    external.notify(message);
    return;
  }

  // Otherwise current environment is unknown, and we are not able to send event.
  throw new BridgeError(ERR_UNKNOWN_ENV);
};
