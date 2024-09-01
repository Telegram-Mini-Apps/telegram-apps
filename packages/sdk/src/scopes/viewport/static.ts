import { request as bridgeRequest, type ExecuteWithOptions } from '@telegram-apps/bridge';
import type { BetterPromise } from '@telegram-apps/toolkit';

import { $postEvent } from '@/scopes/globals/globals.js';

export interface RequestResult {
  height: number;
  isExpanded: boolean;
  isStable: boolean;
  width: number;
}

/**
 * Requests viewport actual information from the Telegram application.
 * @param options - request options.
 */
export function request(options?: ExecuteWithOptions): BetterPromise<RequestResult> {
  return bridgeRequest('web_app_request_viewport', 'viewport_changed', {
    postEvent: $postEvent(),
    ...options || {},
  })
    .then(r => ({
      height: r.height,
      width: r.width,
      isExpanded: r.is_expanded,
      isStable: r.is_state_stable,
    }));
}

export type * from './types.js';
