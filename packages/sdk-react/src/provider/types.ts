import type { PropsWithChildren } from 'react';

import type { InitOptions, InitResult } from '../types.js';

export interface SDKInitOptions extends InitOptions {
  /**
   * Should initialization be asynchronous. This mode is useful in case, you are using SSR
   * and want to perform initialization on the client side only.
   * @default false
   */
  async?: boolean;
}

export type SDKInitResult = InitResult;

export type SDKProviderProps = PropsWithChildren<{
  /**
   * Init function options.
   */
  options?: SDKInitOptions;
}>;

export interface SDKContextType {
  /**
   * Error occurred during initialization.
   */
  error?: unknown;

  /**
   * Initialization result.
   */
  initResult?: SDKInitResult;

  /**
   * True if SDK is loading.
   */
  loading: boolean;
}
