import { type RequestFn, request as _request, PostEventFn } from '@telegram-apps/bridge';

import { $createRequestId, $postEvent } from './globals.js';

/**
 * Creates a new request id.
 */
export function createRequestId(): string {
  return $createRequestId()();
}

/**
 * `request` function from the bridge with applied global `postEvent` option.
 */
export const request: RequestFn = (method: any, eventOrEvents: any, options: any) => {
  options ||= {};
  options.postEvent ||= $postEvent();
  return _request(method, eventOrEvents, options);
};

/**
 * Shortcut for $postEvent call.
 */
export const postEvent = ((method: any, params: any) => {
  return $postEvent()(method, params);
}) as PostEventFn;