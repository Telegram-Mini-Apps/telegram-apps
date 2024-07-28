import { initData } from '@/init-data/parsing/initData.js';
import type { InitDataParsed } from '../types.js';

/**
 * Parses incoming value as init data.
 * @param value - value to parse.
 */
export function parse(value: unknown): InitDataParsed {
  return initData().parse(value);
}
