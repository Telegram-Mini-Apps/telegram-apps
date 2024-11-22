import {
  ExecuteWithOptions,
  CancelablePromise,
  SafeAreaInset,
} from '@telegram-apps/bridge';

import {request as _request} from '@/scopes/globals.js';
import {State} from "@/scopes/components/safe-area/types.js";

export function requestInsets(
  options?: ExecuteWithOptions
): CancelablePromise<State> {
  // @ts-expect-error incorrect linting here
  return CancelablePromise.all([
    requestSafeArea(options),
    requestContentSafeArea(options)
  ]).then(([safeAreaInset, contentSafeAreaInset]) => {
    return new CancelablePromise<State>((resolve) => {
      resolve({
        inset: safeAreaInset,
        contentInset: contentSafeAreaInset
      });
    });
  });
}

/**
 * Requests safe area actual information from the Telegram application.
 * @param options - request options.
 * @example
 * const viewport = await request({
 *   timeout: 1000
 * });
 */
export function requestSafeArea(
  options?: ExecuteWithOptions,
): CancelablePromise<SafeAreaInset> {
  return _request('web_app_request_safe_area', 'safe_area_changed', options);
}

/**
 * Requests content safe area actual information from the Telegram application.
 * @param options - request options.
 * @example
 * const viewport = await request({
 *   timeout: 1000
 * });
 */
export function requestContentSafeArea(
  options?: ExecuteWithOptions,
): CancelablePromise<SafeAreaInset> {
  return _request('web_app_request_content_safe_area', 'content_safe_area_changed', options);
}