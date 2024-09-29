import { initData } from '@telegram-apps/transformers';
import type { InitData } from '@telegram-apps/types';

/**
 * Parses incoming value as init data.
 * @param value - value to check.
 * @throws {TypedError} ERR_PARSE
 * @throws {TypedError} ERR_UNEXPECTED_VALUE
 */
export function parse(value: unknown): InitData {
  return initData()(value);
}