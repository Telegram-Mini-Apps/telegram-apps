import { parseThemeParams } from './parseThemeParams.js';
import type { ThemeParamsParsed } from './types.js';
import { request, type RequestOptions } from '../bridge/index.js';

/**
 * Requests current theme parameters from the Telegram application.
 * @param options - request options.
 */
export function requestThemeParams(options: RequestOptions = {}): Promise<ThemeParamsParsed> {
  return request('web_app_request_theme', 'theme_changed', options)
    .then(parseThemeParams);
}
