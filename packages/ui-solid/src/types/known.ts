/**
 * Known platforms, where components could be used.
 */
export type Platform = 'base' | 'ios';

/**
 * Known color schemes.
 */
export type ColorScheme = 'dark' | 'light';

export interface WithColorScheme {
  /**
   * Current color scheme.
   * @default 'light'
   */
  colorScheme: ColorScheme;
}

export interface WithPlatform {
  /**
   * Identifier of the current platform.
   * @default 'base'
   */
  platform: Platform;
}

/**
 * Properties, shared between all components.
 */
export interface WithConfig extends WithColorScheme, WithPlatform {
}
