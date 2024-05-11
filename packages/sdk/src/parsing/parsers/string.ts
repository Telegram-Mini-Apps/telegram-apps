import { createTypeError } from '../createTypeError.js';
import { createValueParserGenerator } from '../createValueParserGenerator.js';
import type { ValueParserGenerator } from '../createValueParserGenerator.js';

/**
 * Returns parser to parse value as string.
 */
export const string: ValueParserGenerator<string> = createValueParserGenerator((value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString();
  }
  throw createTypeError();
}, 'string');
