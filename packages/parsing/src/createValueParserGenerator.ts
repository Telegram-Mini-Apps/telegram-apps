import { isUndefined } from './isUndefined.js';
import { ValueParser } from './ValueParser.js';
import type { IsEmptyFunc, Parser } from './types.js';

export interface ValueParserGeneratorOptions {
  /**
   * Should return true if passed value is recognized empty for this parser.
   * @default Function which returns true if value is undefined or null.
   */
  isEmpty?: IsEmptyFunc;
}

export interface CreateValueParserGeneratorOptions extends ValueParserGeneratorOptions {
  /**
   * Type name.
   */
  type?: string;
}

/**
 * Creates function which generates new scalar value parser based on the specified one.
 * @param parser - parser to use as basic.
 * @param type - type name.
 * @param genIsEmpty - isEmpty function for parser.
 */
export function createValueParserGenerator<T>(
  parser: Parser<T>,
  {
    type,
    isEmpty: genIsEmpty = isUndefined,
  }: CreateValueParserGeneratorOptions = {},
) {
  // eslint-disable-next-line max-len
  return ({ isEmpty = genIsEmpty }: ValueParserGeneratorOptions = {}) => new ValueParser(parser, false, isEmpty, type);
}
