import type { ColorScheme, Platform } from '../types/index.js';

export interface WithColorScheme {
  /**
   * Current color scheme.
   * @default 'light'
   */
  colorScheme?: ColorScheme;
}

export interface WithPlatform {
  /**
   * Identifier of the current platform.
   * @default 'base'
   */
  platform?: Platform;
}

/**
 * Properties, shared between all components.
 */
export interface WithComponentProps extends WithColorScheme, WithPlatform {
}
