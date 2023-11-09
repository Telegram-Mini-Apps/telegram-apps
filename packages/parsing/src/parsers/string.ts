import { ParsingError } from '../ParsingError.js';
import { createValueParserGen, unknownTypeError } from './shared.js';

/**
 * Returns parser to parse value as string.
 */
export const string = createValueParserGen<string>((value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString();
  }
  throw unexpectedTypeError();
}, {
  type: 'string',
});
