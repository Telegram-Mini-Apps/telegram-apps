import { ArrayValueParser } from '../ArrayValueParser.js';
import { isUndefined } from '../isUndefined.js';

/**
 * Parses incoming value as an array.
 */
export function array(): ArrayValueParser<unknown, false> {
  return new ArrayValueParser((value) => value, false, isUndefined);
}
