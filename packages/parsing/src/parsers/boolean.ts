import { ParsingError } from '../ParsingError.js';
import { unknownTypeError, createValueParserGen } from './shared.js';

/**
 * Returns parser to parse value as boolean.
 */
export const boolean = createValueParserGen<boolean>((value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  const asString = String(value);

  if (asString === '1' || asString === 'true') {
    return true;
  }

  if (asString === '0' || asString === 'false') {
    return false;
  }

  throw unexpectedTypeError();
}, {
  type: 'boolean',
});
