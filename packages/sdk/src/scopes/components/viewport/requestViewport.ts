import type {
  ExecuteWithOptions,
  CancelablePromise,
} from '@telegram-apps/bridge';

import { request as _request } from '@/scopes/globals.js';

export interface RequestViewportResult {
  height: number;
  isExpanded: boolean;
  isStable: boolean;
  width: number;
}

/**
 * Requests viewport actual information from the Telegram application.
 * @param options - request options.
 * @example
 * const viewport = await request({
 *   timeout: 1000
 * });
 */
export function requestViewport(
  options?: ExecuteWithOptions,
): CancelablePromise<RequestViewportResult> {
  return _request('web_app_request_viewport', 'viewport_changed', options).then(r => ({
    height: r.height,
    width: r.width,
    isExpanded: r.is_expanded,
    isStable: r.is_state_stable,
  }));
}
