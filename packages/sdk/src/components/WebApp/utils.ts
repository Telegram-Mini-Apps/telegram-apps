import {Platform} from './types';

/**
 * Returns true in case, passed platform name describes desktop.
 * @param platform - platform name.
 */
export function isDesktop(platform: Platform): boolean {
  return platform === 'tdesktop';
}

/**
 * Returns true in case, passed platform name describes browser.
 * @param platform - platform name.
 */
export function isWeb(platform: Platform): boolean {
  return platform === 'webz';
}