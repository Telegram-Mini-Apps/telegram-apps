import { createContext } from 'solid-js';

import type { ColorScheme, Platform } from '~/types/known.js';

export interface Config {
  /**
   * Current color scheme. This value is reactive.
   */
  colorScheme: ColorScheme;
  /**
   * Identifier of the current platform. This value is reactive.
   */
  platform: Platform;
}

/**
 * @internal
 */
export const ConfigContext = createContext<Config>({
  platform: 'base',
  colorScheme: 'light',
});

