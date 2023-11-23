import { type Accessor, createMemo } from 'solid-js';

import type { SDKInitResultKey, SDKInitResultValue } from './types.js';
import { useSDKContext } from './useSDKContext.js';

/**
 * Returns value by its field name from SDK init result.
 * @param key - init result key.
 * @throws {Error} SDK is not initialized.
 */
export function useSDKInitResultValue<K extends SDKInitResultKey>(
  key: K,
): Accessor<SDKInitResultValue<K>> {
  const { initResult } = useSDKContext();

  return createMemo<SDKInitResultValue<K>>(() => {
    const result = initResult();

    if (!result) {
      throw new Error(`Unable to get init result key "${key}" as long as SDK is not initialized`);
    }
    return result[key];
  });
}
