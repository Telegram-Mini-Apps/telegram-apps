import { camelToSnake, snakeToCamel } from '@telegram-apps/toolkit';
import type { ThemeParams } from '@telegram-apps/types';

import { toRecord } from '@/toRecord.js';
import { rgb } from '@/transformers/rgb.js';
import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import type { TransformerGen } from '@/types.js';

export const themeParams: TransformerGen<ThemeParams> = createTransformerGen(
  'themeParams',
  value => {
    const rgbOptional = rgb(true);

    return Object
      .entries(toRecord(value))
      .reduce<ThemeParams>((acc, [k, v]) => {
        acc[snakeToCamel(k)] = rgbOptional(v);
        return acc;
      }, {});
  },
);

/**
 * Serializes theme parameters to representation sent from the Telegram application.
 */
// #__NO_SIDE_EFFECTS__
export function serializeThemeParams(themeParams: ThemeParams): string {
  return JSON.stringify(
    Object.fromEntries(
      Object
        .entries(themeParams)
        .map(([key, value]) => [camelToSnake(key), value]),
    ),
  );
}

export type { ThemeParams };