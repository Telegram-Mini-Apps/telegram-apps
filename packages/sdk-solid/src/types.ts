import type { InitResult, InitOptions } from '@tma.js/sdk';
import type { Accessor } from 'solid-js';

export type SDKInitOptions = InitOptions;
export type SDKInitResult = InitResult;
export type SDKInitResultKey = keyof SDKInitResult;
export type SDKInitResultValue<K extends SDKInitResultKey> = SDKInitResult[K];

export interface SDKContextType {
  initResult: Accessor<SDKInitResult | null>;
  loading: Accessor<boolean>;
  error: Accessor<unknown | null>;
}