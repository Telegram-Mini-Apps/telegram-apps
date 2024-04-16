import { initData } from './parsers/initData.js';
import type { InitDataParsed } from './types.js';

/**
 * Parses incoming value as init data.
 * @param value - value to parse.
 */
export function parseInitData(value: unknown): InitDataParsed {
  return initData().parse(value);
}
