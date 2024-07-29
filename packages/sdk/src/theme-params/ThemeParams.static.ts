import { request as bridgeRequest } from '@/bridge/request.js';
import { themeParamsParser } from '@/theme-params/themeParamsParser.js';
import type { ThemeParams } from '@/theme-params/types.js';
import type { ExecuteWithOptions } from '@/types/index.js';

/**
 * Converts a palette key from the local representation to the representation sent from the
 * Telegram application.
 * @param key - palette key.
 */
function keyToExternal(key: string): string {
  return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

/**
 * Parses incoming value as theme parameters.
 * @param value - value to parse.
 */
export function parse(value: unknown): ThemeParams {
  return themeParamsParser().parse(value);
}

/**
 * Requests current theme parameters from the Telegram application.
 * @param options - request options.
 */
export function request(options : ExecuteWithOptions): Promise<ThemeParams> {
  return bridgeRequest({
    ...(options || {}),
    method: 'web_app_request_theme',
    event: 'theme_changed',
  }).then(parse);
}

/**
 * Serializes theme parameters to representation sent from the Telegram application.
 */
export function serialize(themeParams: ThemeParams): string {
  return JSON.stringify(
    Object.fromEntries(
      Object
        .entries(themeParams)
        .map(([key, value]) => [keyToExternal(key), value]),
    ),
  );
}
