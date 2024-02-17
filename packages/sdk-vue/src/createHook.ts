import type { ComputedRef } from 'vue';

import { useInitResultValue } from './plugin/index.js';
import type {
  DynamicInitResultKey,
  InitResultKey,
  InitResultValue,
  StaticInitResultKey,
} from './types.js';

export type Hook<K extends InitResultKey> = () => ComputedRef<InitResultValue<K>>;

/**
 * Creates hook to retrieve static init result value.
 * @param initResultKey - init result key.
 */
export function createHook<K extends StaticInitResultKey>(initResultKey: K): Hook<K>;

/**
 * Creates hook to retrieve dynamic init result value.
 * @param initResultKey - init result key.
 */
export function createHook<K extends DynamicInitResultKey>(
  initResultKey: K,
): Hook<K>;

export function createHook(initResultKey: InitResultKey): Hook<any> {
  return () => useInitResultValue(initResultKey);
}
