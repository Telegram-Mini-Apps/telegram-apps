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
  | 'web'
  | 'weba'
  | 'unigram'
  | 'unknown'
  | string;

/**
 * Function which generates unique request identifiers.
 */
export type CreateRequestIdFunc = () => string;
