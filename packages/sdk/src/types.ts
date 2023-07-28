import type { postEvent } from '@twa.js/bridge';

export type PostEvent = typeof postEvent;

/**
 * Color scheme.
 */
export type ColorScheme = 'dark' | 'light';

/**
 * Native Telegram application identifier.
 */
export type Platform =
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
