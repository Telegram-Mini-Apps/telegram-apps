import {InitResult} from 'twa-sdk';

/**
 * List of provided SDK components.
 */
export type SDKComponents = InitResult;

/**
 * Known SDK component name.
 */
export type SDKComponentName = keyof SDKComponents;

/**
 * Returns SDK component type by its name.
 */
export type SDKComponent<N extends SDKComponentName> = SDKComponents[N];

export interface SDKContext {
  /**
   * States, that SDK called `init()` method.
   */
  didInit: boolean;

  /**
   * Error occurred during initialization.
   */
  error: unknown | null;

  /**
   * Components ready to use. This value will be null until initialization
   * is done.
   */
  components: SDKComponents | null;
}