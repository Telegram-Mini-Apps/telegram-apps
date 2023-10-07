import { ParsingError } from '../ParsingError.js';
import { number } from './number.js';
import { createValueParserGen } from './shared.js';

const num = number();

/**
 * Returns parser to parse value as Date.
 */
export const date = createValueParserGen<Date>((value) => {
  if (value instanceof Date) {
    return value;
  }

  try {
    return new Date(num.parse(value) * 1000);
  } catch (cause) {
    throw new ParsingError(value, { type: 'Date', error: cause });
  }
});
