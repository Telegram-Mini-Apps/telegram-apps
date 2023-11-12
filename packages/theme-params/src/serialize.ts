import type { RGB } from '@tma.js/colors';

import type { ThemeParams } from './types.js';

/**
 * Converts palette key from local representation to representation sent from the Telegram
 * application.
 * @param key - palette key.
 */
function convertKey(key: string): string {
  return key
    // Convert camel case to snake case.
    .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    // Replace all "background" strings to "bg".
    .replace(/(^|_)background/, (_, prefix) => `${prefix}bg`);
}

/**
 * Converts theme params to its initial representation.
 * @param themeParams - theme parameters.
 */
export function serialize(themeParams: ThemeParams): string {
  return JSON.stringify(
    Object.entries(themeParams).reduce<Record<string, RGB>>((acc, [key, value]) => {
      acc[convertKey(key)] = value;
      return acc;
    }, {}),
  );
}
