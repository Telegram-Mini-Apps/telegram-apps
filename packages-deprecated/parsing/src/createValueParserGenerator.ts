import { ValueParser } from './ValueParser.js';
import type { Parser } from './types.js';

export type ValueParserGenerator<T> = () => ValueParser<T, false>;

/**
 * Creates function which generates new scalar value parser based on the specified one.
 * @param parser - parser to use as basic.
 * @param type - type name.
 */
export function createValueParserGenerator<T>(
  parser: Parser<T>,
  type?: string,
): ValueParserGenerator<T> {
  return () => new ValueParser(parser, false, type);
}
