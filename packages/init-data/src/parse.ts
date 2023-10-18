import { initData } from './initData.js';
import type { InitData } from './types.js';

/**
 * Parses incoming value as init data.
 * @param value - value to parse.
 */
export function parse(value: unknown): InitData {
  return initData().parse(value);
}
