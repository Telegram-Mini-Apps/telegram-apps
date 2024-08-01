import { ArrayParser } from '@/parsing/ArrayParser/ArrayParser.js';

/**
 * Parses incoming value as an array.
 * @param parserTypeName - parser type name.
 */
export function array(parserTypeName?: string): ArrayParser<unknown, false> {
  return new ArrayParser((value) => value, false, parserTypeName);
}
