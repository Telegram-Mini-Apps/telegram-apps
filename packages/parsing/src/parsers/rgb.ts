import { toRGB } from '@tma.js/colors';
import type { RGB } from '@tma.js/colors';

import { ParsingError } from '../ParsingError.js';
import { string } from './string.js';
import { createValueParserGen } from './shared.js';

const str = string();

/**
 * Returns parser to parse value as RGB color.
 */
export const rgb = createValueParserGen<RGB>((value) => {
  try {
    return toRGB(str.parse(value));
  } catch (cause) {
    throw new ParsingError(value, { type: 'RGB', error: cause });
  }
});
