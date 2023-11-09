import { ArrayValueParser } from '../ArrayValueParser.js';
import { isUndefined } from '../isUndefined.js';

/**
 * Parses incoming value as an array.
 * @param type - parser type name.
 */
export function array(type?: string): ArrayValueParser<unknown, false> {
  return new ArrayValueParser((value) => value, false, isUndefined, type);
}
