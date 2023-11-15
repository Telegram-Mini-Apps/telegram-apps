import { createValueParserGenerator, rgb, toRecord } from '@tma.js/parsing';

import type { ThemeParams } from './types.js';
import { keyToLocal } from './keys.js';

export const themeParams = createValueParserGenerator<ThemeParams>(
  (value) => {
    const parser = rgb().optional();

    return Object
      .entries(toRecord(value))
      .reduce<ThemeParams>((acc, [k, v]) => {
        acc[keyToLocal(k)] = parser.parse(v);
        return acc;
      }, {});
  },
  'ThemeParams',
);
