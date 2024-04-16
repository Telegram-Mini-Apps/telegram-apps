import { targetOrigin as targetOriginFn } from '@/bridge/target-origin.js';
import { log } from '@/debug/debug.js';
import { isIframe } from '@/env/isIframe.js';
import { createError } from '@/errors/createError.js';
import { ERROR_UNKNOWN_ENV } from '@/errors/errors.js';

import type {
  MiniAppsEmptyMethodName,
  MiniAppsMethodName,
  MiniAppsMethodParams,
  MiniAppsNonEmptyMethodName,
} from './types/methods.js';
import { hasExternalNotify } from '../env/hasExternalNotify.js';
import { hasWebviewProxy } from '../env/hasWebviewProxy.js';

interface PostEventOptions {
  /**
   * Origin used while posting message. This option is only used in case,
   * current environment is browser (Web version of Telegram) and could
   * be used for test purposes.
   * @default 'https://web.telegram.org'
   */
  targetOrigin?: string;
}

export type PostEvent = typeof postEvent;

/**
 * Sends event to native application which launched Mini App. This function
 * accepts only events, which require arguments.
 * @param eventType - event name.
 * @param params - event parameters.
 * @param options - posting options.
 * @throws {SDKError} ERROR_UNKNOWN_ENV
 * @see ERROR_UNKNOWN_ENV
 */
export function postEvent<E extends MiniAppsNonEmptyMethodName>(
  eventType: E,
  params: MiniAppsMethodParams<E>,
  options?: PostEventOptions,
): void;

/**
 * Sends event to native application which launched Mini App. This function
 * accepts only events, which require arguments.
 * @param eventType - event name.
 * @param options - posting options.
 * @throws {SDKError} ERROR_UNKNOWN_ENV
 * @see ERROR_UNKNOWN_ENV
 */
export function postEvent(eventType: MiniAppsEmptyMethodName, options?: PostEventOptions): void;

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

  log('postEvent', 'Calling method', { eventType, eventData });

  // Telegram Web.
  if (isIframe()) {
    window.parent.postMessage(JSON.stringify({
      eventType,
      eventData,
    }), targetOrigin);
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
