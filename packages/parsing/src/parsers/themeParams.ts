import type { ThemeParams } from '@telegram-apps/types';

import {
  createValueParserGenerator,
  type ValueParserGenerator,
} from '@/createValueParserGenerator.js';
import { rgb } from '@/parsers/rgb.js';
import { toRecord } from '@/toRecord.js';

/**
 * Converts a palette key from the Telegram application to the representation used by the package.
 * @param key - palette key.
 */
function keyToLocal(key: string): string {
  return key.replace(/_[a-z]/g, (match) => match[1].toUpperCase());
}

export type { ThemeParams };

export const themeParams: ValueParserGenerator<ThemeParams> = createValueParserGenerator(
  (value) => {
    const rgbOptional = rgb().optional();

    return Object
      .entries(toRecord(value))
      .reduce<ThemeParams>((acc, [k, v]) => {
        acc[keyToLocal(k)] = rgbOptional.parse(v);
        return acc;
      }, {});
  },
  'ThemeParams',
);