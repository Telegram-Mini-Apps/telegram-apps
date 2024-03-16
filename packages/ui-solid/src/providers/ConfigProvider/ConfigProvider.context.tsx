import { createContext } from 'solid-js';
import type { Accessor } from 'solid-js';

import type { ColorScheme, Platform } from '~/types/known.js';

export interface Config {
  /**
   * Current color scheme.
   */
  colorScheme: Accessor<ColorScheme>;

  /**
   * Identifier of the current platform.
   */
  platform: Accessor<Platform>;
}

export const configContext = createContext<Config>({
  platform: () => 'base' as const,
  colorScheme: () => 'light' as const,
});

