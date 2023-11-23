import type { InitOptions, InitResult } from '@tma.js/sdk';
import type { PropsWithChildren } from 'react';

/**
 * List of provided SDK components.
 */
export type SDKInitResult = InitResult;

/**
 * Known SDK component name.
 */
export type SDKInitResultKey = keyof SDKInitResult;

export type SDKInitOptions = InitOptions;

export type SDKProviderProps = PropsWithChildren<{
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
  error: unknown | null;

  /**
   * Initialization result.
   */
  initResult: SDKInitResult | null;

  /**
   * True if SDK is loading.
   */
  loading: boolean;
}
