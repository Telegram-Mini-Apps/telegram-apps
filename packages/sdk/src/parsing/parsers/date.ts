import { number } from './number.js';
import { createValueParserGenerator } from '../createValueParserGenerator.js';

/**
 * Returns parser to parse value as Date.
 */
export const date = createValueParserGenerator<Date>((value) => (
  value instanceof Date
    ? value
    : new Date(number().parse(value) * 1000)
), 'Date');
