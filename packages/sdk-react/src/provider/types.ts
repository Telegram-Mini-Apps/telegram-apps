import type { PropsWithChildren } from 'react';

import type { InitOptions, InitResult } from '../types.js';

export type SDKProviderProps = PropsWithChildren<{
  /**
   * Init function options.
   */
  options?: InitOptions;
}>;

export interface SDKContextType {
  /**
   * Error occurred during initialization.
   */
  error?: unknown;

  /**
   * Initialization result.
   */
  initResult?: InitResult;

  /**
   * True if SDK is loading.
   */
  loading: boolean;
}
