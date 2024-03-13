import type { ValueParserGenerator } from '../createValueParserGenerator.js';
import { createValueParserGenerator } from '../createValueParserGenerator.js';
import { unexpectedTypeError } from '../unexpectedTypeError.js';

/**
 * Returns parser to parse value as boolean.
 */
export const boolean: ValueParserGenerator<boolean> = createValueParserGenerator((value) => {
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
}, 'boolean');
