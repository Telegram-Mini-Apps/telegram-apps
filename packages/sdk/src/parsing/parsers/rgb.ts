import { string } from './string.js';
import type { RGB } from '../../colors/index.js';
import { toRGB } from '../../colors/index.js';
import type { ValueParserGenerator } from '../createValueParserGenerator.js';
import { createValueParserGenerator } from '../createValueParserGenerator.js';

/**
 * Returns parser to parse value as RGB color.
 */
export const rgb: ValueParserGenerator<RGB> = createValueParserGenerator((value) => toRGB(string().parse(value)), 'rgb');
