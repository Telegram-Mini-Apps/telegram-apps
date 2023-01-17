/**
 * Color scheme.
 */
type ColorScheme = 'dark' | 'light';

/**
 * Native Telegram application identifier.
 */
type Platform =
  | 'android'
  | 'android_x'
  | 'ios'
  | 'macos'
  | 'tdesktop'
  | 'webk'
  | 'webz'
  | 'unigram'
  | 'unknown'
  | string;

export {ColorScheme, Platform};