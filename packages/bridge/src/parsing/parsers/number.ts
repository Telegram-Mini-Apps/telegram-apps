import { createTypeError } from '../createTypeError.js';
import { createValueParserGenerator } from '../createValueParserGenerator.js';
import type { ValueParserGenerator } from '../createValueParserGenerator.js';

/**
 * Returns parser to parse value as number.
 */
export const number: ValueParserGenerator<number> = createValueParserGenerator((value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const num = Number(value);

    if (!Number.isNaN(num)) {
      return num;
    }
  }

  throw createTypeError();
}, 'number');
