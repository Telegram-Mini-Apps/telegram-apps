import { ParsingError } from '../ParsingError.js';
import { unknownTypeError, createValueParserGen } from './shared.js';

/**
 * Returns parser to parse value as boolean.
 */
export const boolean = createValueParserGen<boolean>((value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  throw new ParsingError(value, { type: 'boolean', error: unknownTypeError() });
});
