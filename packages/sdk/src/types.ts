import type { PostEvent as BridgePostEvent } from '@twa.js/bridge';

export type PostEvent = BridgePostEvent;

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
