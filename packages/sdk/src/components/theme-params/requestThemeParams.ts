import { request } from '@/bridge/utils/request.js';
import type { ExecuteWithOptions } from '@/types/index.js';

import { parseThemeParams } from './parsing/parseThemeParams.js';
import type { ThemeParamsParsed } from './types.js';

/**
 * Requests current theme parameters from the Telegram application.
 * @param options - request options.
 */
export function requestThemeParams(options: ExecuteWithOptions = {}): Promise<ThemeParamsParsed> {
  return request({
    ...options,
    method: 'web_app_request_theme',
    event: 'theme_changed',
  }).then(parseThemeParams);
}
