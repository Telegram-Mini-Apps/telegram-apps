import type { InitResult, InitOptions } from '@tma.js/sdk';
import type { Accessor, ParentProps } from 'solid-js';

/**
 * List of provided SDK components.
 */
export type SDKInitResult = InitResult;

/**
 * Known SDK component name.
 */
export type SDKInitResultKey = keyof SDKInitResult;

export type SDKInitOptions = InitOptions;

export type SDKProviderProps = ParentProps<{
  /**
   * Init function options.
   */
  options?: SDKInitOptions;
}>;

/**
 * Returns SDK component type by its name.
 */
export type SDKInitResultValue<K extends SDKInitResultKey> = SDKInitResult[K];

export interface SDKContextType {
  /**
   * Error occurred during initialization.
   */
  error: Accessor<unknown | null>;

  /**
   * Initialization result.
   */
  initResult: Accessor<SDKInitResult | null>;

  /**
   * True if SDK is loading.
   */
  loading: Accessor<boolean>;
}