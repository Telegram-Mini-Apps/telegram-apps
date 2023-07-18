import type {
  PostEmptyEventName, PostEventName,
  PostEventParams,
  PostNonEmptyEventName,
} from './events.js';
import {
  isIframe,
  hasExternalNotify,
  hasWebviewProxy,
} from '../env.js';

interface PostEventOptions {
  /**
   * Origin used while posting message. This option is only used in case,
   * current environment is browser (Web version of Telegram) and could
   * be used for test purposes.
   * @default 'https://web.telegram.org'
   */
  targetOrigin?: string;
}

/**
 * Sends event to native application which launched Web App. This function
 * accepts only events, which require arguments.
 * @param eventType - event name.
 * @param params - event parameters.
 * @param options - posting options.
 * @throws {Error} Bridge could not determine current
 * environment and possible way to send event.
 */
export function postEvent<E extends PostNonEmptyEventName>(
  eventType: E,
  params: PostEventParams<E>,
  options?: PostEventOptions,
): void;

/**
 * Sends event to native application which launched Web App. This function
 * accepts only events, which require arguments.
 * @param eventType - event name.
 * @param options - posting options.
 * @throws {Error} Bridge could not determine current
 * environment and possible way to send event.
 */
export function postEvent(
  eventType: PostEmptyEventName,
  options?: PostEventOptions,
): void;

export function postEvent(
  eventType: PostEventName,
  paramsOrOptions?: PostEventParams<PostEventName> | PostEventOptions,
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
  const { targetOrigin = 'https://web.telegram.org' } = postOptions;

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

  // Otherwise current environment is unknown, and we are not able to send
  // event.
  throw new Error(
    'Unable to determine current environment and possible '
    + 'way to send event.',
  );
}
