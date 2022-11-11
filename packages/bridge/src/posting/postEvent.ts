import {
  PostEmptyEventName, PostEventName,
  PostEventParams,
  PostNonEmptyEventName,
} from './types';
import {isBrowserEnv, isDesktopOrMobileEnv, isWindowsPhoneEnv} from '../env';

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
 * @param event - event name.
 * @param params - event parameters.
 * @param options - posting options.
 * @throws {Error} Bridge could not determine current
 * environment and possible way to send event.
 */
export function postEvent<E extends PostNonEmptyEventName>(
  event: E,
  params: PostEventParams<E>,
  options?: PostEventOptions,
): void;

/**
 * Sends event to native application which launched Web App. This function
 * accepts only events, which require arguments.
 * @param event - event name.
 * @param options - posting options.
 * @throws {Error} Bridge could not determine current
 * environment and possible way to send event.
 */
export function postEvent(
  event: PostEmptyEventName,
  options?: PostEventOptions,
): void;

export function postEvent(
  event: PostEventName,
  params: any = '',
  options: PostEventOptions = {},
): void {
  if (isBrowserEnv()) {
    return window.parent.postMessage(JSON.stringify({
      eventType: event,
      eventData: params,
    }), options.targetOrigin || 'https://web.telegram.org');
  }
  if (isDesktopOrMobileEnv(window)) {
    return window.TelegramWebviewProxy.postEvent(event, JSON.stringify(params));
  }
  if (isWindowsPhoneEnv(window)) {
    return window.external.notify(JSON.stringify({
      eventType: event,
      eventData: params,
    }));
  }
  // Otherwise, application is not ready to post events.
  throw new Error(
    'Unable to determine current environment and possible ' +
    'way to send event.',
  );
}