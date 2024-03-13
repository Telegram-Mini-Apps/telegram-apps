import { initDataParser } from './initDataParser.js';
import type { InitDataParsed } from './types.js';

/**
 * Parses incoming value as init data.
 * @param value - value to parse.
 */
export function parseInitData(value: unknown): InitDataParsed {
  return initDataParser().parse(value);
}
