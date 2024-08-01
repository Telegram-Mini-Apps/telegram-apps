import { createValueParserGenerator } from '../createValueParserGenerator.js';
import { number } from './number.js';
import type { ValueParserGenerator } from '../createValueParserGenerator.js';

/**
 * Returns parser to parse value as Date.
 */
export const date: ValueParserGenerator<Date> = createValueParserGenerator((value) => (
  value instanceof Date
    ? value
    : new Date(number().parse(value) * 1000)
), 'Date');
