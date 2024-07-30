import {
  createValueParserGenerator,
  type ValueParserGenerator,
} from '@/parsing/createValueParserGenerator.js';
import { rgb } from '@/parsing/parsers/rgb.js';
import { toRecord } from '@/parsing/toRecord.js';

import type { ThemeParams } from './types.js';

/**
 * Converts a palette key from the Telegram application to the representation used by the package.
 * @param key - palette key.
 */
function keyToLocal(key: string): string {
  return key.replace(/_[a-z]/g, (match) => match[1].toUpperCase());
}

export const themeParamsParser: ValueParserGenerator<ThemeParams> = createValueParserGenerator(
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