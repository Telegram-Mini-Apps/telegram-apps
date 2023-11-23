import type { Accessor } from 'solid-js';

import {
  SDKInitResultKey,
  SDKInitResultValue,
  useSDKInitResultDynamicValue,
  DynamicComponentKey,
  useSDKInitResultValue,
} from './provider/index.js';

export type Hook<K extends SDKInitResultKey> = () => Accessor<SDKInitResultValue<K>>;

export function createHook<K extends DynamicComponentKey>(
  initResultKey: K,
  dynamic: true,
): Hook<K>;

export function createHook<K extends Exclude<SDKInitResultKey, DynamicComponentKey>>(
  initResultKey: K,
): Hook<K>;

export function createHook(initResultKey: SDKInitResultKey, dynamic?: true): Hook<any> {
  return dynamic
    ? () => useSDKInitResultDynamicValue(initResultKey as DynamicComponentKey)
    : () => useSDKInitResultValue(initResultKey);
}