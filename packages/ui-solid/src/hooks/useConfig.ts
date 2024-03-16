import { useContext } from 'solid-js';

import type { Config } from '~/providers/ConfigProvider/ConfigProvider.context.js';
import { configContext } from '~/providers/ConfigProvider/ConfigProvider.context.js';

/**
 * Hook, which returns project configuration.
 */
export function useConfig(): Config {
  return useContext(configContext);
}
