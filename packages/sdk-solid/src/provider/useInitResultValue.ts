import { type Accessor, createMemo } from 'solid-js';

import { useSDKContext } from './useSDKContext.js';
import type { InitResultKey, InitResultValue } from '../types.js';

/**
 * Returns value by its field name from SDK init result.
 * @param key - init result key.
 * @throws {Error} SDK is not initialized.
 */
export function useInitResultValue<K extends InitResultKey>(key: K): Accessor<InitResultValue<K>> {
  const { initResult } = useSDKContext();

  // eslint-disable-next-line solid/reactivity
  return createMemo<InitResultValue<K>>(() => {
    const result = initResult();

    if (!result) {
      throw new Error(`Unable to get init result key "${key}" as long as SDK is not initialized`);
    }
    return result[key];
  });
}
