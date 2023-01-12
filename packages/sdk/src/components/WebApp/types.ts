import {Bridge} from 'twa-bridge';
import {RGB, Version} from 'twa-core';
import {ThemeParams as TwaThemeParams} from 'twa-theme-params';

import {MainButtonProps} from '../MainButton';

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

export interface SDKProps {
  /**
   * Bridge instance which provides communication utilities with Telegram
   * native application.
   */
  bridge: Bridge;

  /**
   * Telegram native application identifier.
   * @example "tdesktop"
   */
  platform: Platform;

  /**
   * Telegram Web Apps platform version.
   * @example "6.1"
   */
  version: Version;
}