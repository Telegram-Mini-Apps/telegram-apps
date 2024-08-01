import type { RGB } from '@telegram-apps/types';

import { toRGB } from '../toRGB.js';
import {
  createValueParserGenerator,
  type ValueParserGenerator,
} from '../createValueParserGenerator.js';
import { string } from './string.js';

/**
 * Returns parser to parse value as RGB color.
 */
export const rgb: ValueParserGenerator<RGB> = createValueParserGenerator((value) => toRGB(string().parse(value)), 'rgb');
