import { useContext } from 'react';

import { sdkContext } from './context.js';
import type { SDKComponent, SDKComponentName } from './types.js';

/**
 * Returns current SDK information.
 */
export const useSDK = () => useContext(sdkContext);

/**
 * Returns value by its field name from SDK init result.
 * @param name - component name.
 * @throws {Error} SDK is not initialized.
 */
export function useUnit<N extends SDKComponentName>(name: N): SDKComponent<N> {
  const { components } = useSDK();

  if (components === null) {
    throw new Error(`Unable to get unit "${name}" as long as SDK is not initialized.`);
  }
  return components[name];
}
