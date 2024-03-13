import { ArrayValueParser } from '../ArrayValueParser.js';

/**
 * Parses incoming value as an array.
 * @param parserTypeName - parser type name.
 */
export function array(parserTypeName?: string): ArrayValueParser<unknown, false> {
  return new ArrayValueParser((value) => value, false, parserTypeName);
}
