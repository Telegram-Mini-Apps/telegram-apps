import { keyToExternal } from './keys.js';
import type { ThemeParamsParsed } from './types.js';
import type { RGB } from '../colors/index.js';

/**
 * Serializes theme parameters to representation sent from the Telegram application.
 */
export function serializeThemeParams(themeParams: ThemeParamsParsed): string {
  return JSON.stringify(
    Object
      .entries(themeParams)
      .reduce<Record<string, RGB>>((acc, [key, value]) => {
      if (value) {
        acc[keyToExternal(key)] = value;
      }
      return acc;
    }, {}),
  );
}
