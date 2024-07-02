import { request } from '@/bridge/request.js';
import type { ExecuteWithOptions } from '@/types/index.js';

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
  options: ExecuteWithOptions = {},
): Promise<RequestViewportResult> {
  const {
    is_expanded: isExpanded,
    is_state_stable: isStateStable,
    ...rest
  } = await request({
    ...options,
    method: 'web_app_request_viewport',
    event: 'viewport_changed',
  });

  return { ...rest, isExpanded, isStateStable };
}
