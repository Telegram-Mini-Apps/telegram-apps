import { initData } from '@telegram-apps/transformers';
import type { InitData } from '@telegram-apps/bridge';

/**
 * Parses an incoming value as init data.
 * @param value - value to check.
 * @throws {} Parsing errors.
 */
export function parseInitData(value: unknown): InitData {
  return initData()(value);
}