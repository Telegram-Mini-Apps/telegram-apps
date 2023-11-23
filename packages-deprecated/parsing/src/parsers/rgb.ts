import { toRGB } from '@tma.js/colors';
import type { RGB } from '@tma.js/colors';

import { string } from './string.js';
import { createValueParserGenerator } from '../createValueParserGenerator.js';

const str = string();

/**
 * Returns parser to parse value as RGB color.
 */
export const rgb = createValueParserGenerator<RGB>((value) => toRGB(str.parse(value)), 'rgb');
