import { createTypeError } from '../errors/createTypeError.js';
import {
  createValueParserGenerator,
  type ValueParserGenerator,
} from '../createValueParserGenerator.js';

/**
 * Returns parser to parse value as string.
 */
export const string: ValueParserGenerator<string> = createValueParserGenerator((value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString();
  }
  throw createTypeError();
}, 'string');
