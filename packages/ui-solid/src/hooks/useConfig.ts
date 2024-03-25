import { useContext } from 'solid-js';

import { ConfigContext } from '~/providers/ConfigProvider/ConfigProvider.context.js';
import type { Config } from '~/providers/ConfigProvider/ConfigProvider.context.js';

/**
 * Hook, which returns project configuration.
 */
export function useConfig(): Config {
  return useContext(ConfigContext);
}
