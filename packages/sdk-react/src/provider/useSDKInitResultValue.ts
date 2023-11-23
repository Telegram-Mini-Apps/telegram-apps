import type { SDKInitResultKey, SDKInitResultValue } from './types.js';
import { useSDKContext } from './useSDKContext.js';

/**
 * Returns value by its field name from SDK init result.
 * @param key - init result key.
 * @throws {Error} SDK is not initialized.
 */
export function useSDKInitResultValue<K extends SDKInitResultKey>(key: K): SDKInitResultValue<K> {
  const { initResult } = useSDKContext();

  if (!initResult) {
    throw new Error(`Unable to get init result key "${key}" as long as SDK is not initialized`);
  }
  return initResult[key];
}
