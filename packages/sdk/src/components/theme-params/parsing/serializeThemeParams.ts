import { keyToExternal } from '../keys.js';
import type { ThemeParamsParsed } from '../types.js';

/**
 * Serializes theme parameters to representation sent from the Telegram application.
 */
export function serializeThemeParams(themeParams: ThemeParamsParsed): string {
  return JSON.stringify(
    Object.fromEntries(
      Object
        .entries(themeParams)
        .map(([key, value]) => [keyToExternal(key), value]),
    ),
  );
}
