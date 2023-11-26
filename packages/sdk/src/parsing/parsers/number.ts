import { createValueParserGenerator } from '../createValueParserGenerator.js';
import { unexpectedTypeError } from '../unexpectedTypeError.js';

/**
 * Returns parser to parse value as number.
 */
export const number = createValueParserGenerator<number>((value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const num = Number(value);

    if (!Number.isNaN(num)) {
      return num;
    }
  }

  throw unexpectedTypeError();
}, 'number');
