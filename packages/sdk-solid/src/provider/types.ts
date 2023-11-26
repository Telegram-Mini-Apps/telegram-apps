import type { InitOptions, InitResult } from '@tma.js/sdk';
import type { Accessor, ParentProps } from 'solid-js';

export type SDKProviderProps = ParentProps<{
  /**
   * Init function options.
   */
  options?: InitOptions;
}>;

export interface SDKContextType {
  /**
   * Error occurred during initialization.
   */
  error: Accessor<unknown | undefined>;

  /**
   * Initialization result.
   */
  initResult: Accessor<InitResult | undefined>;

  /**
   * True if SDK is loading.
   */
  loading: Accessor<boolean>;
}
