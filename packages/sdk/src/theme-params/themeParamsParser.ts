import {
  createValueParserGenerator,
  rgb,
  toRecord,
} from '~/parsing/index.js';

import { keyToLocal } from './keys.js';
import type { ThemeParamsParsed } from './types.js';

const rgbOptional = rgb().optional();

export const themeParamsParser = createValueParserGenerator<ThemeParamsParsed>(
  (value) => Object
    .entries(toRecord(value))
    .reduce<ThemeParamsParsed>((acc, [k, v]) => {
    acc[keyToLocal(k)] = rgbOptional.parse(v);
    return acc;
  }, {}),
  'ThemeParams',
);
