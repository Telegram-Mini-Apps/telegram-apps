import type { Platform } from '../../types/platform.js';

/**
 * Returns true if specified platform has stable viewport. Stable means not changing from time to
 * time.
 * @param platform - platform identifier.
 */
export function isStableViewportPlatform(platform: Platform): boolean {
  return ['macos', 'tdesktop', 'unigram', 'web', 'weba'].includes(platform);
}
