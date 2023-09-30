import { SDKInitResult, SDKInitResultKey, SDKInitResultValue } from './types.js';
import { Accessor, createMemo } from 'solid-js';

/**
 * Extracts value from the SDK init result by key.
 * @param result - init result accessor.
 * @param key - key to extract.
 */
export function useInitResultValue<K extends SDKInitResultKey>(
  result: Accessor<SDKInitResult>,
  key: K
): Accessor<SDKInitResultValue<K>> {
  return createMemo(() => result()[key]);
}