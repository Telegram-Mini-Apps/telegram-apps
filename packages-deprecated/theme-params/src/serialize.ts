import type { RGB } from '@tma.js/colors';

import { keyToExternal } from './keys.js';
import type { ThemeParams } from './types.js';

/**
 * Converts theme params to its initial representation.
 * @param themeParams - theme parameters.
 */
export function serialize(themeParams: ThemeParams): string {
  return JSON.stringify(
    Object.entries(themeParams).reduce<Record<string, RGB>>((acc, [key, value]) => {
      if (value) {
        acc[keyToExternal(key)] = value;
      }
      return acc;
    }, {}),
  );
}
