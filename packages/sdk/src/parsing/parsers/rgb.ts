import { string } from './string.js';
import type { RGB } from '../../colors/index.js';
import { toRGB } from '../../colors/index.js';
import { createValueParserGenerator } from '../createValueParserGenerator.js';

/**
 * Returns parser to parse value as RGB color.
 */
export const rgb = createValueParserGenerator<RGB>((value) => toRGB(string().parse(value)), 'rgb');
