import type { ThemeParams } from '@telegram-apps/types';

import { rgb } from '@/transformers/rgb.js';
import { toRecord } from '@/toRecord.js';
import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import type { TransformerGen } from '@/types.js';

/**
 * Converts a palette key from the Telegram application to the representation used by the package.
 * @param key - palette key.
 */
function keyToLocal(key: string): string {
  return key.replace(/_[a-z]/g, (match) => match[1].toUpperCase());
}

export const themeParams: TransformerGen<ThemeParams> = createTransformerGen(
  (value) => {
    const rgbOptional = rgb(true);

    return Object
      .entries(toRecord(value))
      .reduce<ThemeParams>((acc, [k, v]) => {
        acc[keyToLocal(k)] = rgbOptional(v);
        return acc;
      }, {});
  },
  'ThemeParams',
);

export type { ThemeParams };