import { Bridge } from '@twa.js/bridge';

/**
 * Minimal set of properties SDK requires from bridge.
 */
export type BridgeLike = Pick<Bridge, 'postEvent' | 'off' | 'on'>;

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
