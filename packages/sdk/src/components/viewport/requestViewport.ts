import { request } from '@/bridge/request.js';
import type { RequestSimpleOptions } from '@/bridge/request.js';

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
export async function requestViewport(
  options?: RequestSimpleOptions<'web_app_request_viewport'>,
): Promise<RequestViewportResult> {
  const {
    is_expanded: isExpanded,
    is_state_stable: isStateStable,
    ...rest
  } = await request('web_app_request_viewport', 'viewport_changed', options);

  return { ...rest, isExpanded, isStateStable };
}
