import { useSDKContext } from './useSDKContext.js';
import type { InitResultKey, InitResultValue } from '../types.js';

/**
 * Returns value by its field name from SDK init result.
 * @param key - init result key.
 * @throws {Error} SDK is not initialized.
 */
export function useInitResultValue<K extends InitResultKey>(key: K): InitResultValue<K> {
  const { initResult } = useSDKContext();

  if (!initResult) {
    throw new Error(`Unable to get init result key "${key}" as long as SDK is not initialized`);
  }
  return initResult[key];
}
