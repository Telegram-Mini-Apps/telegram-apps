import { createValueParserGenerator } from '../createValueParserGenerator.js';
import { unexpectedTypeError } from '../unexpectedTypeError.js';

/**
 * Returns parser to parse value as string.
 */
export const string = createValueParserGenerator<string>((value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString();
  }
  throw unexpectedTypeError();
}, 'string');
