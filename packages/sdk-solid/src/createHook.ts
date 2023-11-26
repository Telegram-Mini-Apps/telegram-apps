import type { Accessor } from 'solid-js';

import { useInitResultDynamicValue, useInitResultValue } from './provider/index.js';
import type {
  DynamicInitResultKey,
  InitResultKey,
  InitResultValue,
  StaticInitResultKey,
} from './types.js';

export type Hook<K extends InitResultKey> = () => Accessor<InitResultValue<K>>;

/**
 * Creates hook to retrieve static init result value.
 * @param initResultKey - init result key.
 */
export function createHook<K extends StaticInitResultKey>(initResultKey: K): Hook<K>;

/**
 * Creates hook to retrieve dynamic init result value.
 * @param initResultKey - init result key.
 * @param dynamic - flag to let function know this init result value is dynamic.
 */
export function createHook<K extends DynamicInitResultKey>(
  initResultKey: K,
  dynamic: true,
): Hook<K>;

export function createHook(initResultKey: InitResultKey, dynamic?: true): Hook<any> {
  return dynamic
    ? () => useInitResultDynamicValue(initResultKey as DynamicInitResultKey)
    : () => useInitResultValue(initResultKey);
}
