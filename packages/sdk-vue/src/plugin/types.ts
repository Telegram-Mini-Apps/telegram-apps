import type { InitOptions, InitResult } from '@tma.js/sdk';
import type { Ref } from 'vue';

export type SDKPluginProps = {
  /**
   * Init function options.
   */
  options?: InitOptions;
};

export interface SDKContextType {
  /**
   * Error occurred during initialization.
   */
  error: Readonly<Ref<unknown | undefined>>;

  /**
   * Initialization result.
   */
  initResult: Readonly<Ref<InitResult | undefined>>;

  /**
   * True if SDK is loading.
   */
  loading: Readonly<Ref<boolean>>;
}
