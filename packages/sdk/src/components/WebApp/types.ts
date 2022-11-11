/**
 * Web App color keys which could be used to change header or background color.
 */
export type SettableColorKey = 'bg_color' | 'secondary_bg_color';

/**
 * Color scheme.
 */
export type ColorScheme = 'dark' | 'light';

/**
 * Native application environment:
 * - `tdesktop` - desktop application.
 * - `webz` - browser.
 */
export type Platform = 'tdesktop' | 'webz' | string;