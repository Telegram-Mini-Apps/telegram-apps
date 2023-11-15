import { createValueParserGenerator } from '../createValueParserGenerator.js';
import { number } from './number.js';

const num = number();

/**
 * Returns parser to parse value as Date.
 */
export const date = createValueParserGenerator<Date>((value) => (
  value instanceof Date
    ? value
    : new Date(num.parse(value) * 1000)
), 'Date');
