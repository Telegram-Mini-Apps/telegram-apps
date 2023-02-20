import {useContext} from 'react';

import {sdkContext} from './context';
import {SDKComponent, SDKComponentName} from './types';

/**
 * Returns current SDK information.
 */
export const useSDK = () => useContext(sdkContext);

/**
 * Returns component by its name. Throws an error in case, SDK
 * is not initialized.
 * @param name - component name.
 * @throws {Error} SDK is not initialized.
 */
export function useComponent<N extends SDKComponentName>(
  name: N,
): SDKComponent<N> {
  const {components} = useSDK();

  if (components === null) {
    throw new Error(`Unable to get component "${name}" as long as SDK is not initialized.`);
  }
  return components[name];
}
