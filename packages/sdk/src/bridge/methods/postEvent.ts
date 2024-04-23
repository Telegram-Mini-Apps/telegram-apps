import { log } from '@/debug/debug.js';
import { hasExternalNotify } from '@/env/hasExternalNotify.js';
import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
import { isIframe } from '@/env/isIframe.js';
import { createError } from '@/errors/createError.js';
import { ERROR_UNKNOWN_ENV } from '@/errors/errors.js';

import { targetOrigin as targetOriginFn } from '../target-origin.js';
import type {
  MiniAppsMethodName,
  MiniAppsMethodParams, MiniAppsMethodWithOptionalParams,
  MiniAppsMethodWithoutParams,
  MiniAppsMethodWithParams,
} from './types/methods.js';

interface PostEventOptions {
  /**
   * Origin used while posting message. This option is only used in case, current environment
   * is browser (Web version of Telegram) and could be used for test purposes.
   * @default 'https://web.telegram.org'
   */
  targetOrigin?: string;
}

export type PostEvent = typeof postEvent;

/**
 * Calls Mini Apps method with optional parameters.
 * @param method - method name.
 * @param params - method parameters.
 * @param options - posting options.
 * @throws {SDKError} ERROR_UNKNOWN_ENV
 * @see ERROR_UNKNOWN_ENV
 */
export function postEvent<Method extends MiniAppsMethodWithOptionalParams>(
  method: Method,
  params?: MiniAppsMethodParams<Method>,
  options?: PostEventOptions,
): void;

/**
 * Calls Mini Apps method without parameters.
 * @param method - method name.
 * @param options - posting options.
 * @throws {SDKError} ERROR_UNKNOWN_ENV
 * @see ERROR_UNKNOWN_ENV
 */
export function postEvent(method: MiniAppsMethodWithoutParams, options?: PostEventOptions): void;

/**
 * Calls Mini Apps method with parameters.
 * @param method - method name.
 * @param params - method parameters.
 * @param options - posting options.
 * @throws {SDKError} ERROR_UNKNOWN_ENV
 * @see ERROR_UNKNOWN_ENV
 */
export function postEvent<Method extends MiniAppsMethodWithParams>(
  method: Method,
  params: MiniAppsMethodParams<Method>,
  options?: PostEventOptions,
): void;

export function postEvent(
  eventType: MiniAppsMethodName,
  paramsOrOptions?: MiniAppsMethodParams<MiniAppsMethodName> | PostEventOptions,
  options?: PostEventOptions,
): void {
  let postOptions: PostEventOptions = {};
  let eventData: any;

  if (paramsOrOptions === undefined && options === undefined) {
    // Parameters and options were not passed.
    postOptions = {};
  } else if (paramsOrOptions !== undefined && options !== undefined) {
    // Both parameters and options passed.
    postOptions = options;
    eventData = paramsOrOptions;
  } else if (paramsOrOptions !== undefined) {
    // Only parameters were passed.
    if ('targetOrigin' in paramsOrOptions) {
      postOptions = paramsOrOptions;
    } else {
      eventData = paramsOrOptions;
    }
  }
  const { targetOrigin = targetOriginFn() } = postOptions;

  log('Posting event:', { name: eventType, data: eventData });

  // Telegram Web.
  if (isIframe()) {
    window.parent.postMessage(JSON.stringify({ eventType, eventData }), targetOrigin);
    return;
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
  throw createError(
    ERROR_UNKNOWN_ENV,
    'Unable to determine current environment and possible way to send event. You are probably trying to use Mini Apps method outside of Telegram application environment.',
  );
}
