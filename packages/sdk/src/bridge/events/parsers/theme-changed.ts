import type { RGB } from '@/colors/types.js';
import { json } from '@/parsing/parsers/json.js';
import { rgb } from '@/parsing/parsers/rgb.js';
import { toRecord } from '@/parsing/toRecord.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { ThemeChangedPayload } from '../types/payloads.js';

export function themeChanged(): ValueParser<ThemeChangedPayload, false> {
  return json({
    theme_params: (value) => {
      const parser = rgb().optional();

      return Object
        .entries(toRecord(value))
        .reduce<Partial<Record<string, RGB>>>((acc, [k, v]) => {
        acc[k] = parser.parse(v);
        return acc;
      }, {});
    },
  });
}
