import { request as bridgeRequest } from '@/bridge/request.js';
import { postEvent } from '@/scopes/globals/globals.js';
import type { ExecuteWithOptions } from '@/types/index.js';

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
export async function request(options?: ExecuteWithOptions): Promise<RequestResult> {
  const response = await bridgeRequest({
    postEvent: postEvent(),
    ...options || {},
    method: 'web_app_request_viewport',
    event: 'viewport_changed',
  });

  return {
    height: response.height,
    width: response.width,
    isExpanded: response.is_expanded,
    isStable: response.is_state_stable,
  };
}
