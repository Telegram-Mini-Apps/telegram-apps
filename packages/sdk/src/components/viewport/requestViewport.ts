import type { RequestOptions } from '../../bridge/request.js';
import { request } from '../../bridge/request.js';

export interface RequestViewportResult {
  height: number;
  isStateStable: boolean;
  isExpanded: boolean;
  width: number;
}

/**
 * Requests viewport actual information from the Telegram application.
 * @param options - request options.
 */
export async function requestViewport(options?: RequestOptions): Promise<RequestViewportResult> {
  const data = await request('web_app_request_viewport', 'viewport_changed', options);

  return {
    height: data.height,
    width: data.width,
    isExpanded: data.is_expanded,
    isStateStable: data.is_state_stable,
  };
}
